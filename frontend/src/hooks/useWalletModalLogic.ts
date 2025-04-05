import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

type ModalStep = "select" | "connecting" | "signing" | "success" | "failed";

interface WalletModalLogicProps {
  isOpen: boolean;
  connectionState: string;
  isConnectPending: boolean;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  authenticateWithSiwe: () => Promise<boolean>;
  signatureRejected: boolean;
  setPendingVerification: (value: boolean) => void;
  onClose: () => void;
}

export function useWalletModalLogic({
  isOpen,
  connectionState,
  isConnectPending,
  isAuthenticated,
  isAuthenticating,
  authenticateWithSiwe, // Giữ để dùng thủ công nếu cần
  signatureRejected,
  setPendingVerification,
  onClose,
}: WalletModalLogicProps) {
  const [modalStep, setModalStep] = useState<ModalStep>("select");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setModalStep("select");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    switch (connectionState) {
      case "connecting":
      case "isConnectPending":
        setModalStep("connecting");
        timeoutRef.current = setTimeout(() => {
          if (modalStep === "connecting") {
            setModalStep("failed");
            toast.error("Connection timeout", {
              description: "Please check your wallet.",
            });
          }
        }, 10000);
        break;
      case "connected":
        if (!isAuthenticated) {
          setModalStep("signing"); // Chỉ hiển thị UI, không gọi authenticateWithSiwe
        }
        break;
      case "authenticated":
        setModalStep("success");
        setPendingVerification(false);
        setTimeout(onClose, 1000);
        break;
      case "authentication_failed":
        setModalStep("failed");
        break;
      default:
        setModalStep("select");
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [
    isOpen,
    connectionState,
    isConnectPending,
    isAuthenticated,
    isAuthenticating,
    signatureRejected,
    setPendingVerification,
    onClose,
    modalStep,
  ]);

  return { modalStep, setModalStep };
}