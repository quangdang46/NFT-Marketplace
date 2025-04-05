"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { WalletModal } from "./WalletModal";

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
  const { isConnected, isAuthenticated, walletState, isConnecting, isSigning } =
    useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getButtonText = useCallback(() => {
    console.log(
      "walletState",
      walletState,
      "isAuthenticated",
      isAuthenticated,
      "isConnected",
      isConnected
    );
    if (isAuthenticated) return "Connected"; // Ưu tiên isAuthenticated
    switch (walletState) {
      case "connecting":
        return "Connecting...";
      case "signing":
        return "Verifying...";
      case "failed":
        return "Retry Connection";
      default:
        return isConnected ? "Verification Required" : label;
    }
  }, [walletState, isConnected, isAuthenticated, label]);

  useEffect(() => {
    console.log("ConnectButton: State change", {
      isConnected,
      isAuthenticated,
      walletState,
    });
  }, [isConnected, isAuthenticated, walletState, isConnecting, isSigning]);

  const handleOpenModal = () => {
    console.log("Opening modal");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`${className} bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90`}
        onClick={handleOpenModal}
        disabled={isConnecting || isSigning}
      >
        {(isConnecting || isSigning) && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {getButtonText()}
      </Button>
      <WalletModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
