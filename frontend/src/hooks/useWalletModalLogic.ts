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
  authenticateWithSiwe,
  signatureRejected,
  setPendingVerification,
  onClose,
}: WalletModalLogicProps) {
  const [modalStep, setModalStep] = useState<ModalStep>("select");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasClosedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      setModalStep("select");
      hasClosedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    if (isAuthenticated && !hasClosedRef.current) {
      setModalStep("success");
      setPendingVerification(false);
      timeoutRef.current = setTimeout(() => {
        onClose();
        hasClosedRef.current = true;
      }, 1000);
      return;
    }

    switch (connectionState) {
      case "connecting":
        setModalStep("connecting");
        timeoutRef.current = setTimeout(() => {
          if (modalStep === "connecting") {
            setModalStep("failed");
            toast.error("Connection timeout");
          }
        }, 10000);
        break;
      case "connected":
        setModalStep("signing");
        break;
      case "authenticated":
        setModalStep("success");
        setPendingVerification(false);
        timeoutRef.current = setTimeout(() => {
          onClose();
          hasClosedRef.current = true;
        }, 1000);
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
  ]);

  return { modalStep, setModalStep };
}