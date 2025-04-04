/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWallet } from "@/hooks/useWallet";
import { X, ArrowLeft } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState, useEffect } from "react";
import { useWalletModal } from "@/components/providers/WalletProvider";
import { useWalletModalLogic } from "@/hooks/useWalletModalLogic";
import { WalletSelectStep } from "./WalletSelectStep";
import { WalletStatusStep } from "./WalletStatusStep";
import { wallets } from "@/lib/blockchain/walletConfig";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const {
    connectWallet,
    isConnectPending,
    isConnected,
    connectError,
    authError,
    authenticateWithSiwe,
    isAuthenticating,
    connectionState,
    triggerSignatureRequest,
    signatureRejected,
    isAuthenticated,
    address,
  } = useWallet();

  const { pendingVerification, setPendingVerification } = useWalletModal();
  const [mounted, setMounted] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [signatureRetryCount, setSignatureRetryCount] = useState(0);

  const { modalStep, setModalStep } = useWalletModalLogic({
    isOpen,
    connectionState,
    isConnectPending,
    isAuthenticated,
    isAuthenticating,
    authenticateWithSiwe,
    signatureRejected,
    setPendingVerification,
    onClose,
  });

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSelectedWallet(null);
      setSignatureRetryCount(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (modalStep === "success" && isConnected && isAuthenticated) {
      const timer = setTimeout(() => {
        onClose();
        setModalStep("select");
        setSelectedWallet(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [modalStep, isConnected, isAuthenticated, onClose, setModalStep]);

  const handleConnect = async (walletId: string) => {
    setSelectedWallet(walletId);
    setModalStep("connecting");
    const success = await connectWallet(walletId);
    setTimeout(() => setModalStep(success ? "signing" : "failed"), 0);
  };

  const handleManualSignature = async () => {
    setSignatureRetryCount((prev) => prev + 1);
    setModalStep("signing");
    const success = await triggerSignatureRequest();
    setTimeout(() => {
      setModalStep(success ? "success" : "failed");
      if (success) setPendingVerification(false);
    }, 0);
  };

  const handleBack = () => {
    if (["connecting", "signing", "failed"].includes(modalStep)) {
      setModalStep("select");
      setSelectedWallet(null);
      setSignatureRetryCount(0);
    }
  };

  const selectedWalletData = wallets.find((w) => w.id === selectedWallet);

  if (!mounted || !isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="[&>button]:hidden max-w-[360px] p-0 gap-0 overflow-hidden rounded-xl border-0 shadow-2xl bg-[#111111] fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[99]">
        <VisuallyHidden>
          <DialogTitle>Connect Wallet</DialogTitle>
        </VisuallyHidden>
        <DialogDescription>
          Select a wallet to connect to this application
        </DialogDescription>

        <div className="flex justify-between items-center p-5">
          {modalStep === "select" ? (
            <h2 className="text-lg font-bold text-white">Sign in</h2>
          ) : (
            <>
              <button
                onClick={handleBack}
                className="rounded-full h-6 w-6 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <h2 className="text-lg font-bold text-white">
                {selectedWalletData?.name}
              </h2>
            </>
          )}
          <button
            onClick={onClose}
            className="rounded-full h-6 w-6 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {modalStep === "select" ? (
          <WalletSelectStep
            wallets={wallets}
            onConnect={handleConnect}
            isConnectPending={isConnectPending}
            isAuthenticating={isAuthenticating}
            selectedWallet={selectedWallet}
          />
        ) : (
          <WalletStatusStep
            modalStep={modalStep}
            selectedWalletData={selectedWalletData}
            address={address}
            onManualSignature={handleManualSignature}
            onBack={handleBack}
            signatureRetryCount={signatureRetryCount}
            connectError={connectError || undefined}
            authError={authError || undefined}
          />
        )}

        {(connectError || authError) && modalStep === "failed" && (
          <div className="bg-red-900/20 text-red-400 text-xs p-3 border-t border-red-900/30">
            {connectError?.message || authError || "Failed to connect wallet"}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
