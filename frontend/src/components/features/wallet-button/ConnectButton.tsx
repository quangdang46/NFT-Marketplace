"use client";

import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { useWalletModal } from "@/components/providers/WalletProvider";
import { WalletInfo } from "./WalletInfo";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
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
}

export function ConnectButton({
  variant = "default",
  size = "default",
  className = "",
  label = "Connect Wallet",
}: ConnectButtonProps) {
  const {
    isConnected,
    isAuthenticated,
    authenticateWithSiwe,
    isConnectPending,
    isAuthenticating,
    connectionState,
    isSwitchingChain,
    pendingVerification,
  } = useWallet();
  const { modalOpen, openModal, closeModal } = useWalletModal();
  const [buttonText, setButtonText] = useState(label);

  useEffect(() => {
    if (isConnectPending || connectionState === "connecting")
      setButtonText("Connecting...");
    else if (isAuthenticating || connectionState === "authenticating")
      setButtonText("Verifying...");
    else if (isSwitchingChain || connectionState === "switching_chain")
      setButtonText("Switching Chain...");
    else if (isConnected && !isAuthenticated && pendingVerification)
      setButtonText("Verification Required");
    else setButtonText(label);
  }, [
    isConnectPending,
    isAuthenticating,
    isSwitchingChain,
    isConnected,
    isAuthenticated,
    pendingVerification,
    connectionState,
    label,
  ]);

  useEffect(() => {
    if (isConnected && !isAuthenticated && pendingVerification) {
      authenticateWithSiwe().catch(() =>
        toast.error("Auto-verification failed")
      );
    }
  }, [isConnected, isAuthenticated, pendingVerification, authenticateWithSiwe]);

  const isPending = isConnectPending || isAuthenticating || isSwitchingChain;

  return (
    <>
      {isConnected ? (
        <div className="flex items-center gap-2">
          <WalletInfo />
        </div>
      ) : (
        <Button
          variant={variant}
          size={size}
          className={className}
          onClick={openModal}
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {buttonText}
        </Button>
      )}
      <WalletModal isOpen={modalOpen} onClose={closeModal} />
    </>
  );
}
