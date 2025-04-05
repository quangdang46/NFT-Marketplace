"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useWallet } from "@/hooks/useWallet";
import { X, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
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
    isAuthenticated,
    authenticateWithSiwe,
    connectionState,
    signatureRejected,
    address,
    setPendingVerification,
  } = useWallet();
  const { modalStep, setModalStep } = useWalletModalLogic({
    isOpen,
    connectionState,
    isConnectPending,
    isAuthenticated,
    isAuthenticating: false,
    authenticateWithSiwe,
    signatureRejected,
    setPendingVerification,
    onClose,
  });
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [signatureRetryCount, setSignatureRetryCount] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setSelectedWallet(null);
      setSignatureRetryCount(0);
    }
    // Đóng modal nếu đã authenticated
    if (isOpen && isAuthenticated) {
      setModalStep("success");
      setPendingVerification(false);
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  }, [isOpen, isAuthenticated, onClose, setPendingVerification]);

  const handleConnect = async (walletId: string) => {
    setSelectedWallet(walletId);
    setModalStep("connecting");
    const success = await connectWallet(walletId);
    // Kiểm tra cả success từ connectWallet và trạng thái isAuthenticated
    if (success || isAuthenticated) {
      setModalStep("success");
      setPendingVerification(false);
      setTimeout(() => {
        onClose();
      }, 1000);
    } else if (signatureRejected) {
      setModalStep("signing");
    } else {
      setModalStep("failed");
    }
  };

  const handleManualSignature = async () => {
    setSignatureRetryCount((prev) => prev + 1);
    const success = await authenticateWithSiwe();
    if (success || isAuthenticated) {
      setModalStep("success");
      setPendingVerification(false);
      setTimeout(() => {
        onClose();
      }, 1000);
    } else if (signatureRejected) {
      setModalStep("signing");
    } else {
      setModalStep("failed");
    }
  };

  const handleBack = () => {
    if (["connecting", "signing", "failed"].includes(modalStep)) {
      setModalStep("select");
      setSelectedWallet(null);
    }
  };

  const selectedWalletData = wallets.find((w) => w.id === selectedWallet);

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      aria-describedby="modal-content"
    >
      <DialogTitle className="hidden">Sign in</DialogTitle>
      <DialogContent className="[&>button]:hidden max-w-[360px] p-0 bg-[#111111] rounded-xl">
        <div className="flex justify-between items-center p-5">
          {modalStep === "select" ? (
            <h2 className="text-lg font-bold text-white">Sign in</h2>
          ) : (
            <>
              <button
                onClick={handleBack}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <h2 className="text-lg font-bold text-white">
                {selectedWalletData?.name}
              </h2>
            </>
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        {modalStep === "select" ? (
          <WalletSelectStep
            wallets={wallets}
            onConnect={handleConnect}
            isConnectPending={isConnectPending}
            isAuthenticating={false}
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
          />
        )}
      </DialogContent>
    </Dialog>
  );
}