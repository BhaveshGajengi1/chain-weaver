import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { arbitrumSepolia } from 'wagmi/chains';
import { DATALOOM_CONTRACT_ADDRESS, DATALOOM_ABI, encodePixels, decodePixels, type PixelData } from '@/lib/contracts';
import { useState, useCallback } from 'react';
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
      
      toast.loading('Compressing pixel data via DataLoom...', { id: 'store' });
      
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: DATALOOM_ABI,
        functionName: 'storePixels',
        args: [encodedPixels, metadata],
      } as any);

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
    
    // This would use readContract directly for dynamic fetching
    // For now, return null as we'd need the actual contract
    return null;
  }, [isContractDeployed]);

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
  const { isContractDeployed, canvasCount } = useDataLoom();
  const [canvases, setCanvases] = useState<CanvasData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // In a real implementation, this would fetch from the contract
  // For now, return empty array until contract is deployed

  return {
    canvases,
    isLoading,
    isContractDeployed,
    totalCount: canvasCount ? Number(canvasCount) : 0,
  };
}
