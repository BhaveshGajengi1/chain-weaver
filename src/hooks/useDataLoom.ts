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

type StoreFnName = 'storePixels' | 'store_pixels';
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

  // Cache the correct function names (camelCase vs snake_case) once we discover them.
  const storeFnRef = useRef<StoreFnName | null>(null);
  const getCanvasFnRef = useRef<GetCanvasFnName | null>(null);

  // Try camelCase first
  const { data: countCamel, refetch: refetchCamel } = useReadContract({
    address: contractAddress,
    abi: DATALOOM_ABI,
    functionName: 'getCanvasCount',
    query: { enabled: isContractDeployed },
  } as any);

  // Try snake_case as fallback
  const { data: countSnake, refetch: refetchSnake } = useReadContract({
    address: contractAddress,
    abi: DATALOOM_ABI,
    functionName: 'get_canvas_count',
    query: { enabled: isContractDeployed && countCamel === undefined },
  } as any);

  const canvasCount = (countCamel ?? countSnake) as bigint | undefined;

  const refetchCount = useCallback(() => {
    refetchCamel();
    refetchSnake();
  }, [refetchCamel, refetchSnake]);

  // Write contract
  const { writeContractAsync, data: txHash } = useWriteContract();

  // Wait for transaction
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  const pickNiceError = (error: any) => {
    return (
      error?.shortMessage ||
      error?.cause?.shortMessage ||
      error?.details ||
      error?.message ||
      'Transaction failed'
    );
  };

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

      setIsStoring(true);

      try {
        const encodedPixels = encodePixels(pixels);

        toast.loading('Compressing pixel data via DataLoom...', { id: 'store' });

        // Figure out whether the deployed contract uses camelCase or snake_case.
        // We use simulation first so we don’t spam the wallet with failing TX prompts.
        let functionName: StoreFnName = storeFnRef.current ?? 'storePixels';
        if (!storeFnRef.current) {
          const { simulateContract } = await import('wagmi/actions');
          const { config } = await import('@/lib/web3-config');

          const trySimulate = async (fn: StoreFnName) => {
            await simulateContract(config, {
              address: contractAddress,
              abi: DATALOOM_ABI,
              functionName: fn,
              args: [encodedPixels, metadata],
            } as any);
          };

          try {
            await trySimulate('storePixels');
            functionName = 'storePixels';
          } catch {
            await trySimulate('store_pixels');
            functionName = 'store_pixels';
          }

          storeFnRef.current = functionName;
        }

        const hash = await writeContractAsync({
          address: contractAddress,
          abi: DATALOOM_ABI,
          functionName,
          args: [encodedPixels, metadata],
        } as any);

        toast.loading('Waiting for transaction confirmation...', { id: 'store' });

        return hash;
      } catch (error: any) {
        console.error('Error storing pixels:', error);
        toast.error(pickNiceError(error), { id: 'store' });
        return null;
      } finally {
        setIsStoring(false);
      }
    },
    [address, contractAddress, isContractDeployed, writeContractAsync],
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
          try {
            result = await readWith('getCanvas');
            getCanvasFnRef.current = 'getCanvas';
          } catch {
            result = await readWith('get_canvas');
            getCanvasFnRef.current = 'get_canvas';
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
