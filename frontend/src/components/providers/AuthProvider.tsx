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
import axiosInstance from "@/lib/api/axiosClient";
import axios from "axios";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const fetchingStatusRef = useRef(false);
  const verifyingRef = useRef(false);
  const [authStatus, setAuthStatus] = useState<AuthenticationStatus>(
    Cookies.get("auth_token") ? "authenticated" : "loading"
  );

  // Fetch user when:
  useEffect(() => {
    const controller = new AbortController();
    const fetchStatus = async () => {
      if (fetchingStatusRef.current || verifyingRef.current) {
        return;
      }
      const authToken = Cookies.get("auth_token");
      const refreshToken = Cookies.get("refresh_token");

      if (!authToken && !refreshToken) {
        setAuthStatus("unauthenticated");
        return;
      }

      fetchingStatusRef.current = true;

      try {
        const response = await axiosInstance.get("/auth/me", {
          signal: controller.signal,
        });
        setAuthStatus(
          response.data?.success ? "authenticated" : "unauthenticated"
        );
      } catch (error: any) {
        if (axios.isCancel(error)) {
          // Request was canceled, no need to log or update state
          return;
        }
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
    return () => {
      controller.abort();
      window.removeEventListener("focus", fetchStatus);
    };
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
          const { data } = await axiosInstance.post("/auth/verify", {
            message,
            signature,
          });
          if (!data?.accessToken || !data?.refreshToken)
            throw new Error("No tokens received");
          Cookies.set("auth_token", data.accessToken, {
            expires: 1 / 24,
            secure: true,
            sameSite: "strict",
          });

          Cookies.set("refresh_token", data.refreshToken, {
            expires: 7, // 7 ngày
            secure: true,
            sameSite: "strict",
          });

          setAuthStatus("authenticated");
          return true;
        } catch (error) {
          console.error("Error verifying signature:", error);
          Cookies.remove("auth_token", { secure: true, sameSite: "strict" });
          Cookies.remove("refresh_token", { secure: true, sameSite: "strict" });
          setAuthStatus("unauthenticated");
          return false;
        } finally {
          verifyingRef.current = false;
        }
      },

      signOut: async () => {
        try {
          await axiosInstance.post("/auth/logout");
          Cookies.remove("auth_token", { secure: true, sameSite: "strict" });
          Cookies.remove("refresh_token", { secure: true, sameSite: "strict" });
          setAuthStatus("unauthenticated");
        } catch (error) {
          console.error("Error during sign out:", error);
        }
      },
    });
  }, []);

  return (
    <RainbowKitAuthenticationProvider adapter={authAdapter} status={authStatus}>
      <RainbowKitProvider
        theme={{ lightMode: lightTheme(), darkMode: darkTheme() }}
      >
        {children}
      </RainbowKitProvider>
    </RainbowKitAuthenticationProvider>
  );
}
