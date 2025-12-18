import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useReadContracts } from 'wagmi';
import { arbitrumSepolia } from 'wagmi/chains';
import { DATALOOM_CONTRACT_ADDRESS, DATALOOM_ABI, encodePixels, decodePixels, type PixelData } from '@/lib/contracts';
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

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

  // Get contract address for current chain (default to Sepolia testnet)
  const contractAddress = chain?.id
    ? DATALOOM_CONTRACT_ADDRESS[chain.id as keyof typeof DATALOOM_CONTRACT_ADDRESS]
    : DATALOOM_CONTRACT_ADDRESS[arbitrumSepolia.id];

  const isContractDeployed = contractAddress !== '0x0000000000000000000000000000000000000000';

  // Read total canvas count
  const { data: canvasCount, refetch: refetchCount } = useReadContract({
    address: contractAddress,
    abi: DATALOOM_ABI,
    functionName: 'getCanvasCount',
    query: { enabled: isContractDeployed },
  });

  // Write contract
  const { writeContractAsync, data: txHash } = useWriteContract();

  // Wait for transaction
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Store pixels on-chain
  const storePixels = useCallback(async (pixels: PixelData[], metadata: string = '') => {
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
      
      console.log('Storing pixels:', {
        contractAddress,
        encodedPixels,
        metadata,
        isContractDeployed,
      });

      toast.loading('Compressing pixel data via DataLoom...', { id: 'store' });

      const hash = await writeContractAsync({
        address: contractAddress,
        abi: DATALOOM_ABI,
        functionName: 'storePixels',
        args: [encodedPixels, metadata],
      } as any);
      
      console.log('Transaction hash:', hash);

      toast.loading('Waiting for transaction confirmation...', { id: 'store' });

      return hash;
    } catch (error: any) {
      console.error('Error storing pixels:', error);
      toast.error(error.shortMessage || 'Failed to store pixels', { id: 'store' });
      return null;
    } finally {
      setIsStoring(false);
    }
  }, [address, contractAddress, isContractDeployed, writeContractAsync]);

  // Fetch canvas by ID
  const fetchCanvas = useCallback(async (canvasId: bigint): Promise<CanvasData | null> => {
    if (!isContractDeployed) return null;

    try {
      // Use readContract from wagmi for dynamic fetching
      const { readContract } = await import('wagmi/actions');
      const { config } = await import('@/lib/web3-config');

      const result = await readContract(config, {
        address: contractAddress,
        abi: DATALOOM_ABI,
        functionName: 'getCanvas',
        args: [canvasId],
      } as any) as [string, string, `0x${string}`, bigint];

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
  }, [isContractDeployed, contractAddress]);

  return {
    isContractDeployed,
    contractAddress,
    canvasCount: canvasCount as bigint | undefined,
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
  const { isContractDeployed, canvasCount, contractAddress, fetchCanvas } = useDataLoom();
  const [canvases, setCanvases] = useState<CanvasData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // Fetch canvases from the blockchain
  const loadCanvases = useCallback(async (page: number = 0) => {
    if (!isContractDeployed || !canvasCount || canvasCount === 0n) {
      setCanvases([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const totalCount = Number(canvasCount);
      const startIndex = Math.max(0, totalCount - (page * limit) - limit);
      const endIndex = totalCount - (page * limit);

      // Fetch canvases in reverse order (newest first)
      const canvasPromises: Promise<CanvasData | null>[] = [];
      for (let i = endIndex; i > startIndex && i > 0; i--) {
        canvasPromises.push(fetchCanvas(BigInt(i)));
      }

      const fetchedCanvases = await Promise.all(canvasPromises);
      const validCanvases = fetchedCanvases.filter((c): c is CanvasData => c !== null);

      if (page === 0) {
        setCanvases(validCanvases);
      } else {
        setCanvases(prev => [...prev, ...validCanvases]);
      }

      setHasMore(startIndex > 0);
    } catch (error) {
      console.error('Error loading gallery:', error);
      toast.error('Failed to load gallery');
    } finally {
      setIsLoading(false);
    }
  }, [isContractDeployed, canvasCount, limit, fetchCanvas]);

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
