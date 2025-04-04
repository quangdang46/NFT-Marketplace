"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider } from "@tanstack/react-query";
import { config, WalletModalContextType } from "@/lib/blockchain/walletConfig";
import { queryClient } from "@/lib/api/reactQueryClient";

const WalletModalContext = createContext<WalletModalContextType>({
  modalOpen: false,
  openModal: () => {},
  closeModal: () => {},
  pendingVerification: false,
  setPendingVerification: () => {},
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletModalContext.Provider
          value={{
            modalOpen,
            openModal,
            closeModal,
            pendingVerification,
            setPendingVerification,
          }}
        >
          {children}
        </WalletModalContext.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export function useWalletModal() {
  return useContext(WalletModalContext);
}
