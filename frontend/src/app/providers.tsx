"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/api/reactQueryClient";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/api/apolloClient";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/blockchain/wallet";
// import { ThirdwebProvider } from "thirdweb/react";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
