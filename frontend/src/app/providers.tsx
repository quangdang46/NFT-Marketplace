"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/api/reactQueryClient";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/api/apolloClient";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/blockchain/wallet";
import {
  RainbowKitProvider,
  lightTheme,
  darkTheme,
  RainbowKitAuthenticationProvider,
  AuthenticationStatus,
} from "@rainbow-me/rainbowkit";
import { authenticationAdapter } from "@/lib/api/authAdapter";
import axiosInstance from "@/lib/api/axiosClient";
import { useEffect, useState } from "react";
export function Providers({ children }: { children: React.ReactNode }) {
  const [authStatus, setAuthStatus] = useState<AuthenticationStatus>("loading");

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const response = await axiosInstance.get("/auth/me");
        setAuthStatus(
          response.data?.success ? "authenticated" : "unauthenticated"
        );
      } catch (error) {
        console.error("Error fetching user status:", error);
        setAuthStatus("unauthenticated");
      }
    };

    fetchAuthStatus();
  }, []);
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitAuthenticationProvider
          adapter={authenticationAdapter}
          status={authStatus}
        >
          <RainbowKitProvider
            modalSize="wide"
            theme={{
              lightMode: lightTheme(),
              darkMode: darkTheme(),
            }}
            appInfo={{
              appName: "NFT Marketplace",
              learnMoreUrl: "https://rainbowkit.com/",
            }}
          >
            <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
          </RainbowKitProvider>
        </RainbowKitAuthenticationProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
