import { http, createConfig } from 'wagmi';
import { arbitrumSepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// WalletConnect Project ID - get yours at https://cloud.walletconnect.com/
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

export const config = createConfig({
  chains: [arbitrumSepolia],
  connectors: [
    injected(),
    walletConnect({
      projectId,
      metadata: {
        name: 'DataLoom',
        description: 'On-chain data storage primitive for Arbitrum',
        url: 'https://chain-weaver-9f2rfsb5r-bhavesh-gajengis-projects.vercel.app',
        icons: ['https://chain-weaver-9f2rfsb5r-bhavesh-gajengis-projects.vercel.app/favicon.ico'],
      },
      showQrModal: true,
    }),
  ],
  transports: {
    [arbitrumSepolia.id]: http(),
  },
});

export const SUPPORTED_CHAINS = [arbitrumSepolia] as const;
export const DEFAULT_CHAIN = arbitrumSepolia;
