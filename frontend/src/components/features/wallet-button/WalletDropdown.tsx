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
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50 text-gray-900 dark:bg-[#1A1F2C] dark:border-white/10 dark:hover:bg-[#232836] dark:text-white"
        >
          {address && shortenAddress(address)}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-white border border-gray-200 dark:bg-[#1A1F2C] dark:border-white/10"
      >
        <DropdownMenuLabel className="text-gray-900 dark:text-white">
          My Wallet
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-gray-200 dark:bg-white/10" />

        <div className="px-2 py-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Balance
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {walletBalance
              ? `${walletBalance} ${walletBalanceSymbol}`
              : "Loading..."}
          </p>
        </div>

        <DropdownMenuSeparator className="bg-gray-200 dark:bg-white/10" />

        <NetworkSwitcher />

        <DropdownMenuSeparator className="bg-gray-200 dark:bg-white/10" />

        <DropdownMenuItem
          onClick={copyToClipboard}
          className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white cursor-pointer"
        >
          <Copy className="mr-2 h-4 w-4" />
          <span>Copy Address</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={openExplorer}
          className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white cursor-pointer"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          <span>View on Explorer</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-200 dark:bg-white/10" />

        <DropdownMenuItem
          onClick={() => {
            disconnectWallet();
            setIsOpen(false);
          }}
          className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
