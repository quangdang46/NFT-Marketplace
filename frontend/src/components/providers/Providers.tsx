"use client";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider } from "@tanstack/react-query";
import { ApolloProvider } from "@apollo/client";
import { queryClient } from "@/lib/api/reactQueryClient";
import apolloClient from "@/lib/api/apolloClient";
import { config } from "@/lib/blockchain/wallet";
import AuthProvider from "@/components/providers/AuthProvider";
import { Provider } from "react-redux";
import { store } from "@/store/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ApolloProvider client={apolloClient}>
            <AuthProvider>{children}</AuthProvider>
          </ApolloProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Provider>
  );
}
