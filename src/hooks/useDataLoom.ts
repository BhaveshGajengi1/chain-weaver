import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { arbitrumSepolia } from 'wagmi/chains';
import {
  DATALOOM_CONTRACT_ADDRESS,
  DATALOOM_ABI,
  encodePixels,
  decodePixels,
  type PixelData,
} from '@/lib/contracts';
import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as const;

const getStoreGasLimit = (pixelCount: number) => {
  // Gas estimation can fail on some RPCs for Stylus contracts; providing a safe
  // gas limit avoids `eth_estimateGas` JSON-RPC errors.
  const base = 1_200_000;
  const perPixel = 22_000;
  const max = 12_000_000;
  return BigInt(Math.min(max, base + pixelCount * perPixel));
};

type GetCanvasFnName = 'getCanvas' | 'get_canvas';

export type CanvasData = {
  id: bigint;
  pixels: PixelData[];
  metadata: string;
  creator: `0x${string}`;
  timestamp: bigint;
};

export function useDataLoom() {
  const { address, chain } = useAccount();
  const [isStoring, setIsStoring] = useState(false);

  // Resolve contract address for current chain (fallback to Arbitrum Sepolia)
  const contractAddress =
    (chain?.id
      ? (DATALOOM_CONTRACT_ADDRESS[
          chain.id as keyof typeof DATALOOM_CONTRACT_ADDRESS
        ] as `0x${string}` | undefined)
      : undefined) ?? DATALOOM_CONTRACT_ADDRESS[arbitrumSepolia.id] ?? ZERO_ADDRESS;

  const isContractDeployed = Boolean(contractAddress && contractAddress !== ZERO_ADDRESS);

  // Cache the correct function name for getCanvas
  const getCanvasFnRef = useRef<GetCanvasFnName | null>(null);

  // Try snake_case first (Stylus contracts use snake_case)
  const { data: countSnake, refetch: refetchSnake } = useReadContract({
    address: contractAddress,
    abi: DATALOOM_ABI,
    functionName: 'get_canvas_count',
    query: { enabled: isContractDeployed },
  } as any);

  // Try camelCase as fallback
  const { data: countCamel, refetch: refetchCamel } = useReadContract({
    address: contractAddress,
    abi: DATALOOM_ABI,
    functionName: 'getCanvasCount',
    query: { enabled: isContractDeployed && countSnake === undefined },
  } as any);

  const canvasCount = (countSnake ?? countCamel) as bigint | undefined;

  const refetchCount = useCallback(() => {
    refetchSnake();
    refetchCamel();
  }, [refetchSnake, refetchCamel]);

  // Write contract
  const { writeContractAsync, data: txHash } = useWriteContract();

  // Wait for transaction (only when we actually have a hash)
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isTxError,
    error: txError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: Boolean(txHash) },
  });

  const pickNiceError = (error: any): string => {
    const messages = [
      error?.shortMessage,
      error?.message,
      error?.details,
      error?.reason,
      ...(Array.isArray(error?.metaMessages) ? error.metaMessages : []),
      error?.cause?.shortMessage,
      error?.cause?.message,
      error?.cause?.details,
      error?.cause?.reason,
      ...(Array.isArray(error?.cause?.metaMessages) ? error.cause.metaMessages : []),
      error?.cause?.cause?.shortMessage,
      error?.cause?.cause?.message,
      error?.cause?.cause?.details,
      error?.cause?.cause?.reason,
    ]
      .filter(Boolean)
      .map((m) => String(m));

    const haystack = messages.join(' | ');
    const haystackLower = haystack.toLowerCase();

    const clean = (s: string) =>
      s
        .replace(/^.*json[- ]rpc.*?:\s*/i, '')
        .replace(/^execution reverted:\s*/i, '')
        .trim();

    const truncate = (s: string, n = 180) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

    // User rejected the transaction
    if (
      error?.code === 4001 ||
      error?.cause?.code === 4001 ||
      haystackLower.includes('user rejected')
    ) {
      return 'Transaction cancelled';
    }

    // Wrong / unsupported network
    if (
      haystackLower.includes('chain') &&
      (haystackLower.includes('not configured') ||
        haystackLower.includes('unsupported') ||
        haystackLower.includes('wrong network'))
    ) {
      return 'Wrong network. Switch to Arbitrum Sepolia.';
    }

    // Insufficient funds
    if (haystackLower.includes('insufficient funds')) {
      return 'Insufficient ETH for gas fees (Arbitrum Sepolia).';
    }

    // Nonce / replacement issues
    if (haystackLower.includes('nonce too low')) {
      return 'Nonce too low. Try again in a moment.';
    }
    if (haystackLower.includes('replacement transaction underpriced')) {
      return 'A previous transaction is pending. Speed up or cancel it in your wallet.';
    }

    // Gas estimation failures
    if (
      haystackLower.includes('estimate gas') ||
      haystackLower.includes('eth_estimategas') ||
      haystackLower.includes('gas required exceeds allowance')
    ) {
      return 'Gas estimation failed. Please try again (and ensure you have test ETH for gas).';
    }

    // Internal JSON-RPC error (generic RPC failure) — some wallets wrap real failures into this.
    if (haystackLower.includes('internal json-rpc error') || haystackLower.includes('internal error')) {
      return 'RPC node error. Please try again in a moment.';
    }

    // Contract revert - extract reason if possible (but ignore generic RPC placeholders)
    const reason = error?.cause?.reason || error?.reason;
    if (reason && !String(reason).toLowerCase().includes('internal json-rpc error')) {
      return `Contract error: ${truncate(String(reason))}`;
    }

    // Generic revert
    if (haystackLower.includes('execution reverted') || haystackLower.includes('revert')) {
      return 'Transaction reverted by contract.';
    }

    // Prefer short messages (but keep them clean)
    const short = clean(String(error?.shortMessage || error?.cause?.shortMessage || ''));
    if (short) return truncate(short);

    // Fallback to any captured message
    const fallback = clean(messages[0] ?? '');
    if (fallback) return truncate(fallback);

    return 'Transaction failed. Please try again.';
  };

  // Never surface low-level RPC noise to users
  useEffect(() => {
    if (!isTxError || !txError) return;

    toast.error(pickNiceError(txError), { id: 'store' });
  }, [isTxError, txError]);

  // Store pixels on-chain
  const storePixels = useCallback(
    async (pixels: PixelData[], metadata: string = '') => {
      if (!isContractDeployed) {
        toast.error('Contract not deployed yet. Update contract address in src/lib/contracts.ts');
        return null;
      }

      if (!address) {
        toast.error('Please connect your wallet');
        return null;
      }

      if (chain?.id !== arbitrumSepolia.id) {
        toast.error('Wrong network. Switch to Arbitrum Sepolia.');
        return null;
      }

      // NOTE: `useBalance()` was causing a runtime crash in some environments (null getSnapshot).
      // We do a just-in-time balance check instead.
      try {
        const { getBalance } = await import('wagmi/actions');
        const { config } = await import('@/lib/web3-config');
        const bal = await getBalance(config, {
          address,
          chainId: arbitrumSepolia.id,
        });

        if (!bal?.value || bal.value === 0n) {
          toast.error('No Arbitrum Sepolia ETH for gas fees.', {
            id: 'store',
            description: 'Grab a little test ETH from a faucet, then try again.',
            action: {
              label: 'Get test ETH',
              onClick: () => window.open('https://faucets.chain.link/arbitrum-sepolia', '_blank'),
            },
          });
          return null;
        }
      } catch (balanceError) {
        // If balance check fails due to RPC/provider hiccups, don't block the transaction.
        console.warn('Balance check failed, continuing:', balanceError);
      }

      setIsStoring(true);

      try {
        const encodedPixels = encodePixels(pixels);
        const gasLimit = getStoreGasLimit(pixels.length);

        console.log('Storing pixels:', {
          contractAddress,
          pixelCount: pixels.length,
          encodedLength: encodedPixels.length,
          gasLimit: gasLimit.toString(),
          metadata,
        });

        toast.loading('Preparing transaction...', { id: 'store' });

        const { getBytecode, simulateContract } = await import('wagmi/actions');
        const { config } = await import('@/lib/web3-config');

        // Verify contract exists at address (avoids opaque "Internal JSON-RPC error" from some wallets/RPCs)
        const bytecode = await getBytecode(
          config,
          {
            address: contractAddress,
            chainId: arbitrumSepolia.id,
          } as any,
        );
        if (!bytecode || bytecode === '0x') {
          throw new Error(`Contract not found at ${contractAddress}`);
        }

        // Some deployments expose camelCase, others snake_case.
        const txBase = {
          address: contractAddress,
          abi: DATALOOM_ABI,
          args: [encodedPixels, metadata],
          gas: gasLimit,
        } as any;

        const errorText = (e: any) =>
          String(
            [
              e?.shortMessage,
              e?.message,
              e?.details,
              e?.reason,
              ...(Array.isArray(e?.metaMessages) ? e.metaMessages : []),
              e?.cause?.shortMessage,
              e?.cause?.message,
              e?.cause?.details,
              e?.cause?.reason,
              ...(Array.isArray(e?.cause?.metaMessages) ? e.cause.metaMessages : []),
            ]
              .filter(Boolean)
              .join(' | '),
          ).toLowerCase();

        const shouldTryAltSelector = (t: string) =>
          t.includes('method not found') ||
          t.includes('function selector') ||
          t.includes('unknown function') ||
          t.includes('internal json-rpc error');

        // Preflight with eth_call to pick the correct selector and surface revert reasons.
        let preferredFn: 'storePixels' | 'store_pixels' = 'storePixels';
        try {
          await simulateContract(config, {
            ...txBase,
            functionName: 'storePixels',
            account: address,
            chainId: arbitrumSepolia.id,
          } as any);
        } catch (simError: any) {
          const t = errorText(simError);
          if (shouldTryAltSelector(t)) {
            await simulateContract(config, {
              ...txBase,
              functionName: 'store_pixels',
              account: address,
              chainId: arbitrumSepolia.id,
            } as any);
            preferredFn = 'store_pixels';
          } else {
            throw new Error(pickNiceError(simError));
          }
        }

        let hash: `0x${string}`;
        try {
          hash = await writeContractAsync({
            ...txBase,
            functionName: preferredFn,
          });
        } catch (writeError: any) {
          const t = errorText(writeError);
          const isUserRejected =
            writeError?.code === 4001 ||
            writeError?.cause?.code === 4001 ||
            t.includes('user rejected');

          if (!isUserRejected && shouldTryAltSelector(t)) {
            const alt = preferredFn === 'storePixels' ? 'store_pixels' : 'storePixels';
            try {
              hash = await writeContractAsync({
                ...txBase,
                functionName: alt,
              });
            } catch (fallbackError: any) {
              throw new Error(pickNiceError(fallbackError));
            }
          } else {
            throw new Error(pickNiceError(writeError));
          }
        }

        console.log('Transaction submitted:', hash);
        toast.loading('Waiting for transaction confirmation...', { id: 'store' });

        return hash;
      } catch (error: any) {
        console.error('Error storing pixels:', error);
        // Error is already transformed, show it directly
        const msg = error?.message || 'Transaction failed. Please try again.';
        toast.error(msg, { id: 'store' });
        return null;
      } finally {
        setIsStoring(false);
      }
    },
    [address, chain?.id, contractAddress, isContractDeployed, writeContractAsync],
  );

  // Fetch canvas by ID
  const fetchCanvas = useCallback(
    async (canvasId: bigint): Promise<CanvasData | null> => {
      if (!isContractDeployed) return null;

      try {
        const { readContract } = await import('wagmi/actions');
        const { config } = await import('@/lib/web3-config');

        const readWith = async (fn: GetCanvasFnName) =>
          (await readContract(config, {
            address: contractAddress,
            abi: DATALOOM_ABI,
            functionName: fn,
            args: [canvasId],
          } as any)) as [string, string, `0x${string}`, bigint];

        let result: [string, string, `0x${string}`, bigint];
        const cached = getCanvasFnRef.current;
        if (cached) {
          result = await readWith(cached);
        } else {
          // Try snake_case first (Stylus)
          try {
            result = await readWith('get_canvas');
            getCanvasFnRef.current = 'get_canvas';
          } catch {
            result = await readWith('getCanvas');
            getCanvasFnRef.current = 'getCanvas';
          }
        }

        const [pixelDataHex, metadata, creator, timestamp] = result;
        const pixels = decodePixels(pixelDataHex);

        return {
          id: canvasId,
          pixels,
          metadata,
          creator,
          timestamp,
        };
      } catch (error) {
        console.error('Error fetching canvas:', error);
        return null;
      }
    },
    [isContractDeployed, contractAddress],
  );

  return {
    isContractDeployed,
    contractAddress,
    canvasCount,
    storePixels,
    fetchCanvas,
    isStoring: isStoring || isConfirming,
    isConfirmed,
    txHash,
    refetchCount,
  };
}

// Hook to fetch gallery data
export function useGallery(limit: number = 10) {
  const { isContractDeployed, canvasCount, fetchCanvas } = useDataLoom();
  const [canvases, setCanvases] = useState<CanvasData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // Fetch canvases from the blockchain
  const loadCanvases = useCallback(
    async (page: number = 0) => {
      if (!isContractDeployed || !canvasCount || canvasCount === 0n) {
        setCanvases([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const totalCount = Number(canvasCount);
        const startIndex = Math.max(0, totalCount - page * limit - limit);
        const endIndex = totalCount - page * limit;

        // Fetch canvases in reverse order (newest first)
        const canvasPromises: Promise<CanvasData | null>[] = [];
        for (let i = endIndex; i > startIndex && i > 0; i--) {
          canvasPromises.push(fetchCanvas(BigInt(i)));
        }

        const fetchedCanvases = await Promise.all(canvasPromises);
        const validCanvases = fetchedCanvases.filter((c): c is CanvasData => c !== null);

        if (page === 0) setCanvases(validCanvases);
        else setCanvases((prev) => [...prev, ...validCanvases]);

        setHasMore(startIndex > 0);
      } catch (error) {
        console.error('Error loading gallery:', error);
        toast.error('Failed to load gallery');
      } finally {
        setIsLoading(false);
      }
    },
    [isContractDeployed, canvasCount, limit, fetchCanvas],
  );

  // Load initial canvases when contract is deployed
  useEffect(() => {
    if (isContractDeployed && canvasCount) {
      loadCanvases(0);
      setCurrentPage(0);
    }
  }, [isContractDeployed, canvasCount]);

  const loadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadCanvases(nextPage);
  }, [currentPage, loadCanvases]);

  const refresh = useCallback(() => {
    setCurrentPage(0);
    loadCanvases(0);
  }, [loadCanvases]);

  return {
    canvases,
    isLoading,
    isContractDeployed,
    totalCount: canvasCount ? Number(canvasCount) : 0,
    hasMore,
    loadMore,
    refresh,
  };
}
