import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ChevronDown, LogOut, AlertCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { arbitrumSepolia } from 'wagmi/chains';

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: unknown;
  }
}

const ConnectWallet = () => {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isWrongNetwork = isConnected && chain?.id !== arbitrumSepolia.id;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = () => {
    // If there's only one connector or user has MetaMask, connect directly
    if (connectors.length === 1) {
      connect({ connector: connectors[0] });
    } else {
      // Show wallet selection - try injected first, then WalletConnect
      const injectedConnector = connectors.find(c => c.id === 'injected');
      const walletConnectConnector = connectors.find(c => c.id === 'walletConnect');

      // If user has MetaMask/injected wallet, prefer that
      if (injectedConnector && typeof window !== 'undefined' && window.ethereum) {
        connect({ connector: injectedConnector });
      } else if (walletConnectConnector) {
        // Otherwise use WalletConnect which will show QR code
        connect({ connector: walletConnectConnector });
      } else if (injectedConnector) {
        // Fallback to injected (will prompt to install wallet)
        connect({ connector: injectedConnector });
      }
    }
  };

  const handleSwitchToArbitrum = () => {
    switchChain({ chainId: arbitrumSepolia.id });
  };

  if (!isConnected) {
    return (
      <Button
        variant="hero"
        size="sm"
        onClick={handleConnect}
        disabled={isPending}
        className="gap-2"
      >
        <Wallet size={16} />
        {isPending ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    );
  }

  if (isWrongNetwork) {
    return (
      <Button
        variant="destructive"
        size="sm"
        onClick={handleSwitchToArbitrum}
        className="gap-2"
      >
        <AlertCircle size={16} />
        Switch to Arbitrum Sepolia
      </Button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border hover:bg-secondary transition-colors"
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-sm font-medium text-foreground">
          {formatAddress(address!)}
        </span>
        <ChevronDown
          size={14}
          className={`text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
        />
      </motion.button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-card border border-border shadow-xl overflow-hidden z-50"
          >
            <div className="p-3 border-b border-border">
              <p className="text-xs text-muted-foreground">Connected to</p>
              <p className="text-sm font-medium text-primary">{chain?.name}</p>
            </div>
            <button
              onClick={() => {
                disconnect();
                setIsDropdownOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut size={14} />
              Disconnect
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConnectWallet;
