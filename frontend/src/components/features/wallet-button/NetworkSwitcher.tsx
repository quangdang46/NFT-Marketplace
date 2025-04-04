"use client";

import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useWallet } from "@/hooks/useWallet";
import { getChainName, chainColors } from "@/lib/blockchain/walletConfig";
import { Loader2, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export function NetworkSwitcher() {
  const {
    chainId,
    supportedChains,
    switchNetwork,
    triggerChainSwitch,
    isSwitchPending,
    isSwitchingChain,
    switchChainError,
    connectedWalletName,
    forceUpdate,
    chainSwitchPopupVisible,
    targetChainId,
    lastChainSwitchResult,
  } = useWallet();

  const [isOpen, setIsOpen] = useState(false);
  const [activeChainSwitch, setActiveChainSwitch] = useState<number | null>(
    null
  );
  const [switchSuccess, setSwitchSuccess] = useState<number | null>(null);
  const [currentChainId, setCurrentChainId] = useState<number | undefined>(
    chainId
  );
  const [retryCount, setRetryCount] = useState<Record<number, number>>({});
  const switchAttemptRef = useRef<number>(0);
  const switchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update local state when chainId changes
  useEffect(() => {
    if (chainId !== currentChainId) {
      setCurrentChainId(chainId);

      // If we have a successful chain switch to this chain, show success state
      if (
        lastChainSwitchResult?.success &&
        lastChainSwitchResult.chainId === chainId
      ) {
        setSwitchSuccess(chainId);

        // Clear success state after a delay
        if (successTimeoutRef.current) {
          clearTimeout(successTimeoutRef.current);
        }

        successTimeoutRef.current = setTimeout(() => {
          setSwitchSuccess(null);
        }, 3000);
      }
    }
  }, [chainId, currentChainId, lastChainSwitchResult]);

  // Reset success state after a delay
  useEffect(() => {
    if (switchSuccess) {
      const timer = setTimeout(() => {
        setSwitchSuccess(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [switchSuccess]);

  // Show toast for chain switch errors
  useEffect(() => {
    if (switchChainError) {
      toast.error("Network switch failed: " + switchChainError);
    }
  }, [switchChainError, toast]);

  // Clear any pending timeouts on unmount
  useEffect(() => {
    return () => {
      if (switchTimeoutRef.current) {
        clearTimeout(switchTimeoutRef.current);
      }
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  // Track target chain ID changes
  useEffect(() => {
    if (targetChainId) {
      setActiveChainSwitch(targetChainId);
    } else if (!isSwitchingChain) {
      setActiveChainSwitch(null);
    }
  }, [targetChainId, isSwitchingChain]);

  // Track chain switch popup visibility
  useEffect(() => {
    if (chainSwitchPopupVisible) {
      // If the popup is visible, close the dropdown to prevent interference
      setIsOpen(false);
    }
  }, [chainSwitchPopupVisible]);

  const handleSwitchNetwork = async (targetChainId: number) => {
    if (chainId === targetChainId) return;

    try {
      // Increment switch attempt counter for debugging
      switchAttemptRef.current += 1;
      setRetryCount((prev) => ({
        ...prev,
        [targetChainId]: (prev[targetChainId] || 0) + 1,
      }));

      setActiveChainSwitch(targetChainId);
      console.log(
        `[NetworkSwitcher] Initiating chain switch to ${targetChainId}, attempt #${switchAttemptRef.current}`
      );

      // CRITICAL FIX: Force close the dropdown to ensure it doesn't interfere with the MetaMask popup
      setIsOpen(false);

      // CRITICAL FIX: Add a small delay to ensure UI updates before triggering the popup
      await new Promise((resolve) => setTimeout(resolve, 150));

      // CRITICAL FIX: Use direct chain switching without any wrapping
      try {
        // IMPORTANT: Make sure window.ethereum is available
        if (!window.ethereum) {
          throw new Error("No Ethereum provider found");
        }

        // Convert chain ID to hex format with proper padding
        const chainIdHex = `0x${targetChainId.toString(16)}`;
        console.log(
          `[NetworkSwitcher] Requesting switch to chain ID: ${chainIdHex}`
        );

        // Call the raw ethereum request directly
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainIdHex }],
        });

        console.log(
          `[NetworkSwitcher] Direct chain switch request sent for ${targetChainId}`
        );

        // Wait for the chain to actually change
        const checkChainInterval = setInterval(() => {
          if (window.ethereum) {
            window.ethereum
              .request({ method: "eth_chainId" })
              .then((newChainId: string) => {
                const decimalChainId = Number.parseInt(newChainId, 16);
                if (decimalChainId === targetChainId) {
                  clearInterval(checkChainInterval);
                  console.log(
                    `[NetworkSwitcher] Chain successfully switched to ${targetChainId}`
                  );
                  setSwitchSuccess(targetChainId);
                  forceUpdate();
                  toast.success("Network switched", {
                    description: `Successfully switched to ${getChainName(
                      targetChainId
                    )}`,
                  });
                }
              })
              .catch((err: any) => {
                console.error(
                  "[NetworkSwitcher] Error checking chain ID:",
                  err
                );
              });
          }
        }, 500);

        // Set a timeout to clear the interval if it takes too long
        setTimeout(() => {
          clearInterval(checkChainInterval);
        }, 10000);
      } catch (error) {
        console.error("[NetworkSwitcher] Direct chain switch error:", error);

        // Try the regular method as fallback
        const success = await switchNetwork(targetChainId);

        if (success) {
          console.log(
            `[NetworkSwitcher] Chain switch successful to ${targetChainId}, attempt #${switchAttemptRef.current}`
          );
          setSwitchSuccess(targetChainId);
          forceUpdate();
          toast.success("Network switched", {
            description: `Successfully switched to ${getChainName(
              targetChainId
            )}`,
          });
        } else {
          console.log(
            `[NetworkSwitcher] Chain switch failed for ${targetChainId}, attempt #${switchAttemptRef.current}`
          );
          toast.error("Network switch failed", {
            description: "Failed to switch network. Please try again.",
          });
        }
      }
    } catch (error) {
      console.error("[NetworkSwitcher] Error switching network:", error);
      toast.error("Network switch failed", {
        description:
          error instanceof Error ? error.message : "Failed to switch network",
      });
    } finally {
      // Set a timeout to clear the active chain switch state
      switchTimeoutRef.current = setTimeout(() => {
        if (chainId !== targetChainId) {
          setActiveChainSwitch(null);
        }
      }, 3000);
    }
  };

  const handleRetryChainSwitch = async (targetChainId: number) => {
    if (chainId === targetChainId) return;

    try {
      // Update retry count for this chain
      setRetryCount((prev) => ({
        ...prev,
        [targetChainId]: (prev[targetChainId] || 0) + 1,
      }));

      console.log(
        `[NetworkSwitcher] Manually retrying chain switch to ${targetChainId}`
      );

      // CRITICAL FIX: Force close the dropdown to ensure it doesn't interfere with the MetaMask popup
      setIsOpen(false);

      // CRITICAL FIX: Add a small delay to ensure UI updates before triggering the popup
      await new Promise((resolve) => setTimeout(resolve, 150));

      // CRITICAL FIX: Try direct method first
      try {
        // Make sure window.ethereum is available
        if (!window.ethereum) {
          throw new Error("No Ethereum provider found");
        }

        // Convert chain ID to hex format with proper padding
        const chainIdHex = `0x${targetChainId.toString(16)}`;
        console.log(
          `[NetworkSwitcher] Manually requesting switch to chain ID: ${chainIdHex}`
        );

        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainIdHex }],
        });

        console.log(
          `[NetworkSwitcher] Direct chain switch request sent for ${targetChainId}`
        );

        // Wait for the chain to actually change
        const checkChainInterval = setInterval(() => {
          if (window.ethereum) {
            window.ethereum
              .request({ method: "eth_chainId" })
              .then((newChainId: string) => {
                const decimalChainId = Number.parseInt(newChainId, 16);
                if (decimalChainId === targetChainId) {
                  clearInterval(checkChainInterval);
                  console.log(
                    `[NetworkSwitcher] Chain successfully switched to ${targetChainId}`
                  );
                  setSwitchSuccess(targetChainId);
                  forceUpdate();

                  toast.success("Network switched", {
                    description: `Successfully switched to ${getChainName(
                      targetChainId
                    )}`,
                  });
                }
              })
              .catch((err: any) => {
                console.error(
                  "[NetworkSwitcher] Error checking chain ID:",
                  err
                );
              });
          }
        }, 500);

        // Set a timeout to clear the interval if it takes too long
        setTimeout(() => {
          clearInterval(checkChainInterval);
        }, 10000);
      } catch (error) {
        console.error("[NetworkSwitcher] Direct chain switch error:", error);

        // Use the triggerChainSwitch function to manually trigger the chain switch
        const success = await triggerChainSwitch(targetChainId);

        if (success) {
          console.log(
            `[NetworkSwitcher] Manual chain switch successful to ${targetChainId}`
          );
          setSwitchSuccess(targetChainId);

          // Force update UI after successful switch
          forceUpdate();

          toast.success("Network switched", {
            description: `Successfully switched to ${getChainName(
              targetChainId
            )}`,
          });
        } else {
          console.log(
            `[NetworkSwitcher] Manual chain switch failed for ${targetChainId}`
          );
          toast.error("Network switch failed", {
            description: "Failed to switch network. Please try again.",
          });
        }
      }
    } catch (error) {
      console.error("[NetworkSwitcher] Error in manual chain switch:", error);
      toast.error("Network switch failed", {
        description:
          error instanceof Error ? error.message : "Failed to switch network",
      });
    }
  };

  return (
    <DropdownMenuSub open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuSubTrigger>
        <div className="flex items-center">
          <span className="mr-2">Network</span>
          {chainId && (
            <div className="flex items-center text-xs bg-secondary px-2 py-1 rounded-full">
              {isSwitchingChain ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin text-blue-400" />
              ) : (
                <div
                  className="w-2 h-2 rounded-full mr-1"
                  style={{ backgroundColor: chainColors[chainId] || "#888888" }}
                />
              )}
              <span>{getChainName(chainId)}</span>
            </div>
          )}
        </div>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="min-w-[220px]">
        {supportedChains.map((chain) => {
          const isActive = chainId === chain.id;
          const isSwitching =
            activeChainSwitch === chain.id ||
            (isSwitchingChain && targetChainId === chain.id);
          const isSuccess = switchSuccess === chain.id;
          const retryCountForChain = retryCount[chain.id] || 0;

          return (
            <DropdownMenuItem
              key={chain.id}
              disabled={isSwitchPending || isActive || isSwitchingChain}
              onClick={() => handleSwitchNetwork(chain.id)}
              className={`${
                isActive ? "bg-secondary" : ""
              } cursor-pointer transition-colors`}
              data-testid={`chain-option-${chain.id}`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 mr-2 rounded-full"
                    style={{
                      backgroundColor: chainColors[chain.id] || "#888888",
                    }}
                  />
                  <span>{chain.name}</span>
                </div>
                <div className="ml-2 flex items-center">
                  {isActive && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                  {isSwitching && (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                  )}
                  {isSuccess && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}

                  {/* CRITICAL FIX: Add a retry button for failed chain switches */}
                  {!isActive &&
                    !isSwitching &&
                    !isSuccess &&
                    retryCountForChain > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRetryChainSwitch(chain.id);
                        }}
                        className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        title="Retry network switch"
                      >
                        <RefreshCw className="h-3 w-3 text-blue-500" />
                      </button>
                    )}
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}

        {/* Display wallet info to help with debugging */}
        <div className="px-2 py-2 mt-2 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            Connected with:{" "}
            <span className="text-gray-400">
              {connectedWalletName || "Unknown"}
            </span>
          </p>
        </div>

        {/* CRITICAL FIX: Add a manual retry button for chain switching */}
        {isSwitchingChain && targetChainId && (
          <div className="px-2 py-2 border-t border-gray-800">
            <button
              onClick={() => handleRetryChainSwitch(targetChainId)}
              className="w-full text-xs text-blue-500 hover:text-blue-600 flex items-center justify-center py-1"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry Network Switch
            </button>
          </div>
        )}

        {switchChainError && (
          <div className="px-2 py-2 text-xs text-red-400 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            {switchChainError}
          </div>
        )}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
