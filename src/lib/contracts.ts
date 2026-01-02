import { arbitrumSepolia } from "wagmi/chains";

// DataLoom Stylus contract deployed on Arbitrum Sepolia
// Deployed by: 0x00DEfe6c8fE01610406Aa58538952D5b7d92c56e
// Contract Address: 0x6cde03dcc72c4af932138603a20718b25b2f5aef
export const DATALOOM_CONTRACT_ADDRESS = {
  [arbitrumSepolia.id]: "0x6cde03dcc72c4af932138603a20718b25b2f5aef" as `0x${string}`,
} as const;


// DataLoom Contract ABI
// Stylus contracts use snake_case function names from Rust
export const DATALOOM_ABI = [
  {
    type: 'function',
    name: 'store_pixels',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'pixel_data', type: 'bytes' },
      { name: 'metadata', type: 'string' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'get_canvas',
    stateMutability: 'view',
    inputs: [{ name: 'canvas_id', type: 'uint256' }],
    outputs: [
      { name: '', type: 'bytes' },
      { name: '', type: 'string' },
      { name: '', type: 'address' },
      { name: '', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'get_canvas_count',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'get_creator',
    stateMutability: 'view',
    inputs: [{ name: 'canvas_id', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }],
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
  const encoded = pixels
    .map((p) => {
      const colorHex = p.color.replace("#", "");
      return `${p.x.toString(16).padStart(4, "0")}${p.y.toString(16).padStart(4, "0")}${colorHex}`;
    })
    .join("");
  return `0x${encoded}`;
}

// Decode bytes back to pixels
export function decodePixels(data: string): PixelData[] {
  if (!data || data === "0x") return [];

  const hex = data.replace("0x", "");
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
export function getArbiscanUrl(chainId: number, hash: string, type: "tx" | "address" = "tx"): string {
  return `https://sepolia.arbiscan.io/${type}/${hash}`;
}
