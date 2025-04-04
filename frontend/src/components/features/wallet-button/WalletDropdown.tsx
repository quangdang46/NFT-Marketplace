"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { Copy, ExternalLink, LogOut, ChevronDown } from "lucide-react";
import { NetworkSwitcher } from "./NetworkSwitcher";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function WalletDropdown() {
  const {
    address,
    walletBalance,
    walletBalanceSymbol,
    disconnectWallet,
    currentChain,
    chainId,
    isSwitchingChain,
    lastUpdated,
  } = useWallet();

  const [isOpen, setIsOpen] = useState(false);
  const [currentChainId, setCurrentChainId] = useState<number | undefined>(
    chainId
  );

  // Update local state when chainId changes
  useEffect(() => {
    if (chainId !== currentChainId) {
      setCurrentChainId(chainId);
    }
  }, [chainId, currentChainId]);

  // Force update UI when lastUpdated changes
  useEffect(() => {
    if (lastUpdated) {
      // This will trigger a re-render when the wallet state changes
    }
  }, [lastUpdated]);

  // Close dropdown when switching chain
  useEffect(() => {
    if (isSwitchingChain) {
      setIsOpen(false);
    }
  }, [isSwitchingChain]);

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast("Address copied", {
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const openExplorer = () => {
    if (address && currentChain) {
      let explorerUrl = "";

      // Use the block explorer from the current chain if available
      if (currentChain.blockExplorers?.default?.url) {
        explorerUrl = `${currentChain.blockExplorers.default.url}/address/${address}`;
      } else {
        // Default fallback based on chain ID
        if (chainId === 1) {
          explorerUrl = `https://etherscan.io/address/${address}`;
        } else if (chainId === 137) {
          explorerUrl = `https://polygonscan.com/address/${address}`;
        } else if (chainId === 42161) {
          explorerUrl = `https://arbiscan.io/address/${address}`;
        } else if (chainId === 10) {
          explorerUrl = `https://optimistic.etherscan.io/address/${address}`;
        } else if (chainId === 8453) {
          explorerUrl = `https://basescan.org/address/${address}`;
        } else {
          // Default fallback
          explorerUrl = `https://etherscan.io/address/${address}`;
        }
      }

      window.open(explorerUrl, "_blank");
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {address && shortenAddress(address)}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Wallet</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <div className="px-2 py-2">
          <p className="text-sm font-medium">Balance</p>
          <p className="text-lg font-bold">
            {walletBalance
              ? `${walletBalance} ${walletBalanceSymbol}`
              : "Loading..."}
          </p>
        </div>

        <DropdownMenuSeparator />

        <NetworkSwitcher />

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={copyToClipboard}>
          <Copy className="mr-2 h-4 w-4" />
          <span>Copy Address</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={openExplorer}>
          <ExternalLink className="mr-2 h-4 w-4" />
          <span>View on Explorer</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            disconnectWallet();
            setIsOpen(false);
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
