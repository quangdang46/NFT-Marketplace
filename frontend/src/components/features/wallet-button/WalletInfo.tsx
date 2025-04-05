/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Copy,
  ExternalLink,
  LogOut,
  ChevronDown,
  RefreshCw,
  Shield,
  Loader2,
  Check,
} from "lucide-react";
import { NetworkSwitcher } from "./NetworkSwitcher";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export function WalletInfo() {
  const {
    address,
    isConnected,
    isAuthenticated,
    disconnectWallet,
    isConnecting,
    isSigning,
    walletBalance,
    walletBalanceSymbol,
    isBalanceLoading,
    currentChain,
    isSwitchingChain,
  } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isSwitchingChain) setIsOpen(false);
    return () => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    };
  }, [isSwitchingChain]);

  const shortenAddress = (addr?: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setShowCopiedToast(true);
      toast("Address copied", {
        description: "Wallet address copied to clipboard",
      });
      dropdownTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
        setShowCopiedToast(false);
      }, 1500);
    }
  };

  const openExplorer = () => {
    if (address && currentChain?.blockExplorers?.default?.url) {
      window.open(
        `${currentChain.blockExplorers.default.url}/address/${address}`,
        "_blank"
      );
      dropdownTimeoutRef.current = setTimeout(() => setIsOpen(false), 500);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await disconnectWallet();
      toast("Wallet disconnected", {
        description: "Your wallet has been disconnected",
      });
    } catch (error) {
      toast("Disconnect error", { description: "Failed to disconnect wallet" });
    } finally {
      setIsDisconnecting(false);
      setIsOpen(false);
    }
  };

  const isLoading =
    isBalanceLoading || isConnecting || isSigning || isSwitchingChain;

  if (!isConnected || !isAuthenticated) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50 text-gray-900 dark:bg-[#1A1F2C] dark:border-white/10 dark:hover:bg-[#232836] dark:text-white rounded-xl px-4 h-10 shadow-sm transition-colors ${
            isLoading ? "opacity-80" : ""
          }`}
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 animate-spin mr-1 ${isLoading ? "" : "hidden"}`}
          />
          <span className="font-medium text-gray-800 dark:text-white">
            {shortenAddress(address)}
          </span>
          <ChevronDown className="text-gray-800 dark:text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-72 rounded-xl p-1 shadow-xl border border-gray-200 mt-5 bg-white dark:bg-[#1A1F2C] dark:border-white/10"
      >
        <DropdownMenuLabel className="px-4 py-3">
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="font-bold text-gray-800 dark:text-white">
                My Wallet
              </span>
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full">
                MetaMask
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-normal">
                {shortenAddress(address)}
              </span>
              {isAuthenticated && (
                <div className="flex items-center text-green-600 dark:text-green-400 text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </div>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1 bg-gray-200 dark:bg-white/10" />
        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 mx-1 rounded-lg">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Balance
          </p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">
            {isBalanceLoading ? (
              <span className="flex items-center">
                <Loader2 className="h-3 w-3 text-blue-500 dark:text-blue-400 animate-spin mr-2" />
                Loading...
              </span>
            ) : walletBalance ? (
              `${walletBalance} ${walletBalanceSymbol}`
            ) : (
              "0.0000"
            )}
          </p>
        </div>
        <DropdownMenuSeparator className="my-1 bg-gray-200 dark:bg-white/10" />
        <NetworkSwitcher />
        <DropdownMenuSeparator className="my-1 bg-gray-200 dark:bg-white/10" />
        <DropdownMenuItem
          onClick={copyToClipboard}
          className="cursor-pointer rounded-lg mx-1 px-3 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/5 transition-colors"
        >
          {showCopiedToast ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-500 dark:text-green-400" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy Address
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={openExplorer}
          className="cursor-pointer rounded-lg mx-1 px-3 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/5 transition-colors"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1 bg-gray-200 dark:bg-white/10" />
        <DropdownMenuItem
          onClick={handleDisconnect}
          className="cursor-pointer rounded-lg mx-1 px-3 py-2.5 text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 transition-colors"
          disabled={isDisconnecting}
        >
          {isDisconnecting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
