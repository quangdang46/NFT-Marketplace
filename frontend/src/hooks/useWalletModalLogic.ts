"use client";

import { useState, useEffect, useRef } from "react";

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
}: {
  isOpen: boolean;
  connectionState: string;
  isConnectPending: boolean;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  authenticateWithSiwe: () => Promise<boolean>;
  signatureRejected: boolean;
  setPendingVerification: (value: boolean) => void;
  onClose: () => void;
}) {
  const [modalStep, setModalStep] = useState<
    "select" | "connecting" | "signing" | "success" | "failed"
  >("select");
  const modalStateRef = useRef(modalStep);
  const authTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    modalStateRef.current = modalStep;
  }, [modalStep]);

  useEffect(() => {
    if (!isOpen) {
      setModalStep("select");
      if (authTimeoutRef.current) clearTimeout(authTimeoutRef.current);
      if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
      return;
    }

    if (connectionState === "connecting" || isConnectPending) {
      setModalStep("connecting");
      connectTimeoutRef.current = setTimeout(() => {
        if (modalStateRef.current === "connecting") {
          setModalStep("failed");
          console.error("Connection timeout: No response from wallet");
        }
      }, 60000);
    } else if (
      connectionState === "connected" &&
      !isAuthenticated &&
      !isAuthenticating
    ) {
      setModalStep("signing");
      if (!authTimeoutRef.current) {
        authTimeoutRef.current = setTimeout(() => {
          authenticateWithSiwe()
            .then((success) => {
              if (success) {
                setModalStep("success");
                setPendingVerification(false);
                onClose();
              } else {
                setModalStep("failed");
              }
            })
            .catch((error) => {
              console.error("Authentication failed:", error);
              setModalStep("failed");
            });
        }, 500);
      }
    } else if (connectionState === "authenticated") {
      setModalStep("success");
      setPendingVerification(false);
      onClose();
    } else if (
      connectionState === "authentication_failed" ||
      signatureRejected
    ) {
      setModalStep("failed");
    }

    return () => {
      if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
        authTimeoutRef.current = null;
      }
    };
  }, [
    isOpen,
    connectionState,
    isConnectPending,
    isAuthenticated,
    isAuthenticating,
    authenticateWithSiwe,
    signatureRejected,
    setPendingVerification,
    onClose,
  ]);

  return { modalStep, setModalStep };
}
