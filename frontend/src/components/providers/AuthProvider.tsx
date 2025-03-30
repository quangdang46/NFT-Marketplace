/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  RainbowKitProvider,
  lightTheme,
  darkTheme,
  RainbowKitAuthenticationProvider,
  AuthenticationStatus,
  createAuthenticationAdapter,
} from "@rainbow-me/rainbowkit";
import { useEffect, useMemo, useRef, useState } from "react";
import { createSiweMessage } from "viem/siwe";
import Cookies from "js-cookie";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/api/apolloClient";
import {
  NonceDocument,
  VerifyDocument,
  MeDocument,
  LogoutDocument,
} from "@/lib/api/graphql/generated";
import { useDispatch } from "react-redux";
import { connectWallet, disconnectWallet } from "@/store/slices/authSlice";
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  const fetchingStatusRef = useRef(false);
  const verifyingRef = useRef(false);
  const [authStatus, setAuthStatus] = useState<AuthenticationStatus>(
    Cookies.get("auth_token") ? "authenticated" : "loading"
  );

  useEffect(() => {
    const fetchStatus = async () => {
      if (fetchingStatusRef.current || verifyingRef.current) return;
      const authToken = Cookies.get("auth_token");
      const refreshToken = Cookies.get("refresh_token");

      if (!authToken && !refreshToken) {
        setAuthStatus("unauthenticated");
        return;
      }

      fetchingStatusRef.current = true;

      try {
        const { data, errors } = await client.query({ query: MeDocument });
        console.log("Me response:", { data, errors });
        if (errors) {
          console.error("GraphQL errors in me:", errors);
          throw new Error("Failed to fetch user data");
        }
        setAuthStatus(data.me ? "authenticated" : "unauthenticated");
      } catch (error) {
        console.error("Error fetching auth status:", error);
        dispatch(disconnectWallet());
        setAuthStatus("unauthenticated");
      } finally {
        fetchingStatusRef.current = false;
      }
    };

    fetchStatus();
    window.addEventListener("focus", fetchStatus);
    return () => window.removeEventListener("focus", fetchStatus);
  }, []);

  const authAdapter = useMemo(() => {
    return createAuthenticationAdapter({
      getNonce: async () => {
        try {
          const { data } = await client.query({ query: NonceDocument });
          return data.nonce;
        } catch (error) {
          throw error;
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
          const { data } = await client.mutate({
            mutation: VerifyDocument,
            variables: { message, signature },
          });
          const { accessToken, refreshToken } = data.verify;
          if (!accessToken || !refreshToken)
            throw new Error("No tokens received");

          Cookies.set("auth_token", accessToken, {
            expires: 1 / 24,
            secure: true,
            sameSite: "strict",
          });
          Cookies.set("refresh_token", refreshToken, {
            expires: 7,
            secure: true,
            sameSite: "strict",
          });
          dispatch(connectWallet({ token: accessToken }));
          setAuthStatus("authenticated");
          return true;
        } catch (error) {
          console.error("Error verifying signature:", error);
          Cookies.remove("auth_token", { secure: true, sameSite: "strict" });
          Cookies.remove("refresh_token", { secure: true, sameSite: "strict" });
          dispatch(disconnectWallet());

          setAuthStatus("unauthenticated");
          return false;
        } finally {
          verifyingRef.current = false;
        }
      },

      signOut: async () => {
        try {
          const { data } = await client.mutate({ mutation: LogoutDocument });
          console.log("Logout response:", data); // Debug
          Cookies.remove("auth_token", { secure: true, sameSite: "strict" });
          Cookies.remove("refresh_token", { secure: true, sameSite: "strict" });
          dispatch(disconnectWallet());
          setAuthStatus("unauthenticated");
        } catch (error) {
          console.error("Error during sign out:", error);
        }
      },
    });
  }, []);

  return (
    <ApolloProvider client={client}>
      <RainbowKitAuthenticationProvider
        adapter={authAdapter}
        status={authStatus}
      >
        <RainbowKitProvider
          theme={{ lightMode: lightTheme(), darkMode: darkTheme() }}
        >
          {children}
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </ApolloProvider>
  );
}
