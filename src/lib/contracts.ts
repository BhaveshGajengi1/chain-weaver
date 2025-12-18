import { arbitrum, arbitrumSepolia } from 'wagmi/chains';

// TODO: Replace with your deployed DataLoom contract address
export const DATALOOM_CONTRACT_ADDRESS = {
  [arbitrum.id]: '0x0000000000000000000000000000000000000000' as `0x${string}`,
  [arbitrumSepolia.id]: '0x51153772D6E88FEF51467850390256F6bC61b4a4' as `0x${string}`,
} as const;

// DataLoom Contract ABI - Update with your actual ABI
export const DATALOOM_ABI = [
  {
    name: 'storePixels',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'pixelData', type: 'bytes' },
      { name: 'metadata', type: 'string' },
    ],
    outputs: [{ name: 'canvasId', type: 'uint256' }],
  },
  {
    name: 'getCanvas',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'canvasId', type: 'uint256' }],
    outputs: [
      { name: 'pixelData', type: 'bytes' },
      { name: 'metadata', type: 'string' },
      { name: 'creator', type: 'address' },
      { name: 'timestamp', type: 'uint256' },
    ],
  },
  {
    name: 'getCanvasCount',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'getCanvasesByCreator',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'creator', type: 'address' }],
    outputs: [{ name: '', type: 'uint256[]' }],
  },
  {
    name: 'CanvasStored',
    type: 'event',
    inputs: [
      { name: 'canvasId', type: 'uint256', indexed: true },
      { name: 'creator', type: 'address', indexed: true },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
] as const;

export type PixelData = {
  x: number;
  y: number;
  color: string;
};

// Encode pixels to bytes for on-chain storage
export function encodePixels(pixels: PixelData[]): `0x${string}` {
  // Simple encoding: each pixel = x (2 bytes) + y (2 bytes) + color (3 bytes RGB)
  const encoded = pixels.map(p => {
    const colorHex = p.color.replace('#', '');
    return `${p.x.toString(16).padStart(4, '0')}${p.y.toString(16).padStart(4, '0')}${colorHex}`;
  }).join('');
  return `0x${encoded}`;
}

// Decode bytes back to pixels
export function decodePixels(data: string): PixelData[] {
  if (!data || data === '0x') return [];

  const hex = data.replace('0x', '');
  const pixels: PixelData[] = [];

  // Each pixel is 14 hex chars (4 + 4 + 6)
  for (let i = 0; i < hex.length; i += 14) {
    const chunk = hex.slice(i, i + 14);
    if (chunk.length < 14) break;

    pixels.push({
      x: parseInt(chunk.slice(0, 4), 16),
      y: parseInt(chunk.slice(4, 8), 16),
      color: `#${chunk.slice(8, 14)}`,
    });
  }

  return pixels;
}

// Get Arbiscan explorer URL for transaction or address
export function getArbiscanUrl(chainId: number, hash: string, type: 'tx' | 'address' = 'tx'): string {
  const baseUrl = chainId === arbitrum.id
    ? 'https://arbiscan.io'
    : 'https://sepolia.arbiscan.io';

  return `${baseUrl}/${type}/${hash}`;
}

