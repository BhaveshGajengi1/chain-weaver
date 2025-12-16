import { http, createConfig } from 'wagmi';
import { arbitrum, arbitrumSepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [arbitrum, arbitrumSepolia],
  connectors: [
    injected(),
  ],
  transports: {
    [arbitrum.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
});

export const SUPPORTED_CHAINS = [arbitrum, arbitrumSepolia] as const;
export const DEFAULT_CHAIN = arbitrum;
