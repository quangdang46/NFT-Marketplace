"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
} from "react";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider } from "@tanstack/react-query";
import { config, WalletModalContextType } from "@/lib/blockchain/walletConfig";
import { queryClient } from "@/lib/api/reactQueryClient";

const WalletModalContext = createContext<WalletModalContextType>({
  modalOpen: false,
  openModal: () => {},
  closeModal: () => {},
  verificationRequired: true,
  setVerificationRequired: () => {},
  pendingVerification: false,
  setPendingVerification: () => {},
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [verificationRequired, setVerificationRequired] = useState(true);
  const [pendingVerification, setPendingVerification] = useState(false);

  const openModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const contextValue = {
    modalOpen,
    openModal,
    closeModal,
    verificationRequired,
    setVerificationRequired,
    pendingVerification,
    setPendingVerification,
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletModalContext.Provider value={contextValue}>
          {children}
        </WalletModalContext.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export function useWalletModal() {
  return useContext(WalletModalContext);
}
