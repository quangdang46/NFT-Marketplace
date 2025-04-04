/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { useWalletModal } from "@/components/providers/WalletProvider";
import { WalletInfo } from "./WalletInfo";
import { Shield, ShieldAlert, KeyRound, Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { WalletModal } from "./WalletModal";
import { toast } from "sonner";

interface ConnectButtonProps {
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  label?: string;
  requireAuth?: boolean;
}

export function ConnectButton({
  variant = "default",
  size = "default",
  className = "",
  label = "Connect Wallet",
  requireAuth = false,
}: ConnectButtonProps) {
  const {
    isConnected,
    isAuthenticated,
    address,
    lastAuthenticatedAddress,
    authenticateWithSiwe,
    isConnectPending,
    isAuthenticating,
    connectionState,
    isSwitchingChain,
    chainId,
    lastUpdated,
  } = useWallet();

  const {
    modalOpen,
    openModal,
    closeModal,
    pendingVerification,
    setPendingVerification,
  } = useWalletModal();
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentConnectionState, setCurrentConnectionState] =
    useState(connectionState);
  const [currentChainId, setCurrentChainId] = useState(chainId);
  const [buttonText, setButtonText] = useState(label);
  const [signatureAttempts, setSignatureAttempts] = useState(0);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const verifyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoVerifyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialAuthCheckRef = useRef(false); // Add this ref to track initial auth check
  const authInProgressRef = useRef(false); // Add this ref to prevent duplicate auth
  // Update local state when connection state changes
  useEffect(() => {
    if (connectionState !== currentConnectionState) {
      setCurrentConnectionState(connectionState);
      updateButtonText(connectionState);
    }
  }, [connectionState, currentConnectionState]);

  // Update local state when chain changes
  useEffect(() => {
    if (chainId !== currentChainId) {
      setCurrentChainId(chainId);
    }
  }, [chainId, currentChainId]);

  // Update button text based on connection state
  const updateButtonText = (state: string) => {
    if (state === "connecting") {
      setButtonText("Connecting...");
    } else if (state === "authenticating") {
      setButtonText("Verifying...");
    } else if (state === "switching_chain") {
      setButtonText("Switching Chain...");
    } else if (isVerifying) {
      setButtonText("Verifying...");
    } else if (pendingVerification) {
      setButtonText("Verification Required");
    } else {
      setButtonText(label);
    }

    // Reset button text after a delay
    if (
      state !== "disconnected" &&
      state !== "connected" &&
      state !== "authenticated"
    ) {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }

      loadingTimeoutRef.current = setTimeout(() => {
        if (pendingVerification) {
          setButtonText("Verification Required");
        } else {
          setButtonText(label);
        }
      }, 5000);
    }
  };

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      if (verifyTimeoutRef.current) {
        clearTimeout(verifyTimeoutRef.current);
      }
      if (autoVerifyTimeoutRef.current) {
        clearTimeout(autoVerifyTimeoutRef.current);
      }
    };
  }, []);

  // Force update UI when lastUpdated changes
  useEffect(() => {
    if (lastUpdated) {
      // This will trigger a re-render when the wallet state changes
    }
  }, [lastUpdated]);

  // Force update UI when wallet state changes
  useEffect(() => {
    if (connectionState === "connecting" || isConnectPending) {
      setButtonText("Connecting...");
    } else if (connectionState === "authenticating" || isAuthenticating) {
      setButtonText("Verifying...");
    } else if (connectionState === "switching_chain" || isSwitchingChain) {
      setButtonText("Switching Chain...");
    } else if (isVerifying) {
      setButtonText("Verifying...");
    } else if (pendingVerification) {
      setButtonText("Verification Required");
    } else if (isAuthenticated) {
      setButtonText(label); // Cập nhật ngay khi xác thực thành công
    } else {
      setButtonText(label);
    }
  }, [
    isConnected,
    isAuthenticated,
    address,
    chainId,
    connectionState,
    isSwitchingChain,
    isConnectPending,
    isAuthenticating,
    lastUpdated,
    isVerifying,
    label,
    pendingVerification,
  ]);
  // If authentication is required but user is not authenticated
  const showAuthWarning = requireAuth && isConnected && !isAuthenticated;

  // Check if the connected address matches the authenticated address
  const addressMismatch =
    isConnected && isAuthenticated && address !== lastAuthenticatedAddress;

  useEffect(() => {
    if (!isConnected) {
      initialAuthCheckRef.current = false; // Reset khi ngắt kết nối
      authInProgressRef.current = false; // Reset khi ngắt kết nối
      setSignatureAttempts(0);
      setIsVerifying(false);
    }
  }, [isConnected]);

  const handleVerify = async () => {
    if (
      isConnected &&
      !isVerifying &&
      !isAuthenticating &&
      !authInProgressRef.current
    ) {
      authInProgressRef.current = true;
      setIsVerifying(true);
      setSignatureAttempts((prev) => prev + 1);

      try {
        await new Promise((resolve) => setTimeout(resolve, 150));
        const success = await authenticateWithSiwe();
        if (success) {
          setPendingVerification(false);
          toast("Wallet verified", {
            description: "Your wallet has been successfully verified",
          });
        } else {
          toast.error("Verification failed. Failed to verify your wallet", {
            description: "Failed to verify your wallet",
          });
        }
      } catch (error) {
        toast.error("Verification error", {
          description: "An error occurred during verification",
        });
      } finally {
        setIsVerifying(false);
        authInProgressRef.current = false;
        if (verifyTimeoutRef.current) {
          clearTimeout(verifyTimeoutRef.current);
          verifyTimeoutRef.current = null;
        }
      }
    }
  };

  // Determine button state
  const isPending =
    isConnectPending ||
    isAuthenticating ||
    isVerifying ||
    connectionState === "connecting" ||
    connectionState === "authenticating" ||
    connectionState === "switching_chain" ||
    isSwitchingChain;

  // Get button label based on state
  const getButtonLabel = () => {
    if (isPending) {
      return buttonText;
    }
    if (isConnected && !isAuthenticated) {
      return "Verification Required";
    }
    return label;
  };

  return (
    <>
      {isConnected ? (
        <div
          className="flex items-center gap-2"
          data-testid="wallet-connected-state"
        >
          {showAuthWarning && (
            <div className="flex items-center text-amber-600 text-xs mr-2">
              <ShieldAlert className="h-4 w-4 mr-1" />
              Not verified
            </div>
          )}
          {isAuthenticated && !addressMismatch && (
            <div className="flex items-center text-green-600 text-xs mr-2">
              <Shield className="h-4 w-4 mr-1" />
              Verified
            </div>
          )}
          {addressMismatch && (
            <div className="flex items-center text-amber-600 text-xs mr-2">
              <ShieldAlert className="h-4 w-4 mr-1" />
              Re-verification needed
            </div>
          )}
          {!isAuthenticated && (
            <button
              onClick={handleVerify}
              className="flex items-center text-blue-600 text-xs mr-2 hover:text-blue-800 transition-colors"
              disabled={isVerifying || authInProgressRef.current}
              data-testid="verify-button"
            >
              {isVerifying ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <KeyRound className="h-4 w-4 mr-1" />
              )}
              Verify
            </button>
          )}
          <WalletInfo />
        </div>
      ) : (
        <Button
          type="button"
          variant={variant}
          size={size}
          className={className}
          onClick={openModal}
          disabled={isPending}
          data-testid="connect-wallet-button"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {getButtonLabel()}
            </>
          ) : (
            label
          )}
        </Button>
      )}

      <WalletModal isOpen={modalOpen} onClose={closeModal} />

      {/* <CustomWalletModal isOpen={modalOpen} onClose={closeModal} /> */}
    </>
  );
}
