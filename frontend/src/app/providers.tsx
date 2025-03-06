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
  createAuthenticationAdapter,
} from "@rainbow-me/rainbowkit";
import axiosInstance from "@/lib/api/axiosClient";
import { useEffect, useMemo, useRef, useState } from "react";
import { createSiweMessage } from "viem/siwe";
import Cookies from "js-cookie";

export function Providers({ children }: { children: React.ReactNode }) {
  const fetchingStatusRef = useRef(false);
  const verifyingRef = useRef(false);
  const [authStatus, setAuthStatus] = useState<AuthenticationStatus>("loading");

  // Fetch user when:
  useEffect(() => {
    const fetchStatus = async () => {
      if (fetchingStatusRef.current || verifyingRef.current) {
        return;
      }

      fetchingStatusRef.current = true;

      try {
        const response = await axiosInstance.get("/auth/me");
        console.log("Auth status:", response.data);
        setAuthStatus(
          response.data?.success ? "authenticated" : "unauthenticated"
        );
      } catch (error) {
        console.error("Error fetching auth status:", error);
        setAuthStatus("unauthenticated");
      } finally {
        fetchingStatusRef.current = false;
      }
    };

    // 1. page loads
    fetchStatus();

    // 2. window is focused (in case user logs out of another window)
    window.addEventListener("focus", fetchStatus);
    return () => window.removeEventListener("focus", fetchStatus);
  }, []);

  const authAdapter = useMemo(() => {
    return createAuthenticationAdapter({
      getNonce: async () => {
        try {
          const response = await axiosInstance.get("/auth/nonce");
          return response.data.nonce;
        } catch (error) {
          console.error("Error fetching nonce:", error);
          throw error; // Để RainbowKit xử lý lỗi
        }
      },

      createMessage: ({ nonce, address, chainId }) => {
        return createSiweMessage({
          domain: window.location.host,
          address,
          statement: "Sign in with Ethereum to the app.",
          uri: window.location.origin,
          version: "1",
          chainId,
          nonce,
        });
      },

      verify: async ({ message, signature }) => {
        verifyingRef.current = true;

        try {
          const verifyRes = await axiosInstance.post("/auth/verify", {
            message,
            signature,
          });
          const token = verifyRes?.data?.token;

          if (!token) {
            console.error("No token received from server");
            return false;
          }
          Cookies.set("auth_token", token, {
            expires: 1,
            secure: true,
            sameSite: "strict",
          });
          setAuthStatus("authenticated");
          return true;
        } catch (error) {
          console.error("Error verifying signature:", error);
          setAuthStatus("unauthenticated");
          return false;
        } finally {
          verifyingRef.current = false;
        }
      },

      signOut: async () => {
        setAuthStatus("unauthenticated");
        try {
          await axiosInstance.post("/auth/logout");

          Cookies.remove("auth_token", {
            secure: true,
            sameSite: "strict",
          });
          setAuthStatus("unauthenticated");
          console.log("Đã ngắt kết nối ví");
        } catch (error) {
          console.error("Error during sign out:", error);
        }
      },
    });
  }, []);
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitAuthenticationProvider
          adapter={authAdapter}
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
