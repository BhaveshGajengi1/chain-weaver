import { http, createConfig } from 'wagmi';
import { arbitrumSepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [arbitrumSepolia],
  connectors: [
    injected(),
  ],
  transports: {
    [arbitrumSepolia.id]: http(),
  },
});

export const SUPPORTED_CHAINS = [arbitrumSepolia] as const;
export const DEFAULT_CHAIN = arbitrumSepolia;
