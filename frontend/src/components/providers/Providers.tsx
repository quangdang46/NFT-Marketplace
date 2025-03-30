"use client";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider } from "@tanstack/react-query";
import { ApolloProvider } from "@apollo/client";
import { queryClient } from "@/lib/api/reactQueryClient";
import apolloClient from "@/lib/api/apolloClient";
import { config } from "@/lib/blockchain/wallet";
import AuthProvider from "@/components/providers/AuthProvider";
import { Provider as ReduxProvider } from "react-redux";
import { persistor, store } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <ApolloProvider client={apolloClient}>
              <AuthProvider>{children}</AuthProvider>
            </ApolloProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
