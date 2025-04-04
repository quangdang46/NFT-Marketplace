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
  KeyRound,
  Loader2,
  Check,
} from "lucide-react";
import { NetworkSwitcher } from "./NetworkSwitcher";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export function WalletInfo() {
  const {
    address,
    walletBalance,
    walletBalanceSymbol,
    disconnectWallet,
    chainId,
    currentChain,
    connectedWalletName,
    isAuthenticated,
    isBalanceLoading,
    authenticateWithSiwe,
    lastAuthenticatedAddress,
    connectionState,
    isSwitchingChain,
    triggerSignatureRequest,
  } = useWallet();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<string | undefined>(
    address
  );
  const [currentChainId, setCurrentChainId] = useState<number | undefined>(
    chainId
  );
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [signatureAttempts, setSignatureAttempts] = useState(0);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const verifyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update local state when address or chainId changes
  useEffect(() => {
    if (address !== currentAddress) {
      setCurrentAddress(address);
    }
  }, [address, currentAddress]);

  useEffect(() => {
    if (chainId !== currentChainId) {
      setCurrentChainId(chainId);
    }
  }, [chainId, currentChainId]);

  // Check if the connected address matches the authenticated address
  const addressMismatch =
    isAuthenticated && address !== lastAuthenticatedAddress;

  // Close dropdown when switching chain
  useEffect(() => {
    if (isSwitchingChain) {
      setIsOpen(false);
    }
  }, [isSwitchingChain]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
      if (verifyTimeoutRef.current) {
        clearTimeout(verifyTimeoutRef.current);
      }
    };
  }, []);

  const shortenAddress = (address?: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setShowCopiedToast(true);

      // Show a temporary "Copied!" indicator
      toast("Address copied", {
        description: "Wallet address copied to clipboard",
      });

      // Hide the dropdown after a short delay
      dropdownTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
        setShowCopiedToast(false);
      }, 1500);
    }
  };

  const openExplorer = () => {
    if (address && currentChain?.blockExplorers?.default?.url) {
      const explorerUrl = `${currentChain.blockExplorers.default.url}/address/${address}`;
      window.open(explorerUrl, "_blank");

      // Hide the dropdown after a short delay
      dropdownTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 500);
    }
  };

  const handleVerify = async () => {
    if (address) {
      setIsVerifying(true);
      setSignatureAttempts((prev) => prev + 1);
      try {
        // CRITICAL FIX: Close the dropdown before triggering the signature popup
        // This prevents UI interference with the popup
        setIsOpen(false);

        // CRITICAL FIX: Add a small delay to ensure UI updates before triggering the popup
        await new Promise((resolve) => setTimeout(resolve, 150));

        // CRITICAL FIX: Set a timeout to detect if the signature popup doesn't appear
        verifyTimeoutRef.current = setTimeout(() => {
          if (isVerifying) {
            console.log(
              "Signature popup may not be visible. Attempting to retry..."
            );
            // Try to trigger the signature request again
            triggerSignatureRequest().catch(console.error);
          }
        }, 5000);

        const success = await authenticateWithSiwe();
        if (success) {
          toast("Wallet verified", {
            description: "Your wallet has been successfully verified",
          });
        } else {
          toast("Verification failed", {
            description: "Failed to verify your wallet",
          });
        }
      } catch (error) {
        toast("Verification error", {
          description: "An error occurred during verification",
        });
      } finally {
        setIsVerifying(false);
        // Clear the verification timeout
        if (verifyTimeoutRef.current) {
          clearTimeout(verifyTimeoutRef.current);
          verifyTimeoutRef.current = null;
        }
      }
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
      toast("Disconnect error", {
        description: "Failed to disconnect wallet",
      });
    } finally {
      setIsDisconnecting(false);
      setIsOpen(false);
    }
  };

  // Determine if we're in a loading state
  const isLoading =
    isBalanceLoading ||
    isSwitchingChain ||
    connectionState === "switching_chain";

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={`flex items-center gap-2 border-gray-200 bg-white hover:bg-gray-50 rounded-xl px-4 h-10 shadow-sm transition-colors ${
            isLoading ? "opacity-80" : ""
          }`}
          data-testid="wallet-info-dropdown"
          disabled={isLoading}
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin mr-1" />
          ) : null}
          <span className="font-medium text-gray-800">
            {address && shortenAddress(address)}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-72 rounded-xl p-1 shadow-xl border border-gray-200 mt-5"
      >
        <DropdownMenuLabel className="px-4 py-3">
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="font-bold text-gray-800">My Wallet</span>
              {connectedWalletName && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  {connectedWalletName}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 mt-1 font-normal">
                {address && shortenAddress(address)}
              </span>
              {isAuthenticated && !addressMismatch ? (
                <div className="flex items-center text-green-600 text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </div>
              ) : (
                <button
                  onClick={handleVerify}
                  className="flex items-center text-blue-600 text-xs hover:text-blue-800 transition-colors"
                  disabled={isVerifying}
                  data-testid="dropdown-verify-button"
                >
                  {isVerifying ? (
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <KeyRound className="h-3 w-3 mr-1" />
                  )}
                  Verify now
                </button>
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1" />

        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 mx-1 rounded-lg">
          <p className="text-sm font-medium text-gray-500 mb-1">Balance</p>
          <p className="text-xl font-bold text-gray-800">
            {isBalanceLoading ? (
              <span className="flex items-center">
                <Loader2 className="h-3 w-3 text-blue-500 animate-spin mr-2" />
                Loading...
              </span>
            ) : walletBalance ? (
              `${walletBalance} ${walletBalanceSymbol}`
            ) : (
              "0.0000"
            )}
          </p>
        </div>

        <DropdownMenuSeparator className="my-1" />

        <NetworkSwitcher />

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          onClick={copyToClipboard}
          className="cursor-pointer rounded-lg mx-1 px-3 py-2.5 text-gray-700 hover:text-gray-900 transition-colors"
          data-testid="copy-address-button"
        >
          {showCopiedToast ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-500" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              <span>Copy Address</span>
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={openExplorer}
          className="cursor-pointer rounded-lg mx-1 px-3 py-2.5 text-gray-700 hover:text-gray-900 transition-colors"
          data-testid="view-explorer-button"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          <span>View on Explorer</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          onClick={handleDisconnect}
          className="cursor-pointer rounded-lg mx-1 px-3 py-2.5 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          data-testid="disconnect-button"
          disabled={isDisconnecting}
        >
          {isDisconnecting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
