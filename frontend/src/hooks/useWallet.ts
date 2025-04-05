"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSignMessage,
  useBalance,
  useSwitchChain,
  useChainId,
} from "wagmi";
import { createSiweMessage } from "viem/siwe";
import Cookies from "js-cookie";
import { toast } from "sonner";
import client from "@/lib/api/apolloClient";
import { NonceDocument, VerifyDocument } from "@/lib/api/graphql/generated";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  connectWalletRedux,
  disconnectWalletRedux,
} from "@/store/slices/authSlice";
import { supportedChains, getChainById } from "@/lib/blockchain/walletConfig";

type WalletState =
  | "disconnected"
  | "connecting"
  | "signing"
  | "authenticated"
  | "failed";

export function useWallet() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address,
    chainId,
    query: {
      enabled: !!address && !!chainId,
    },
  });

  const [walletState, setWalletState] = useState<WalletState>("disconnected");

  // Đồng bộ walletState với isConnected và token
  useEffect(() => {
    const hasToken = !!Cookies.get("auth_token");
    if (isConnected && hasToken && walletState !== "authenticated") {
      setWalletState("authenticated");
    } else if (
      !isConnected &&
      !hasToken &&
      walletState !== "connecting" &&
      walletState !== "signing"
    ) {
      setWalletState("disconnected");
    }
  }, [isConnected, walletState]);

  const connectMutation = useMutation({
    mutationFn: async (walletId: string) => {
      const connector =
        connectors.find((c) => c.id === walletId) ||
        connectors.find((c) => c.id === "metaMask");
      if (!connector) throw new Error("Wallet not supported");
      await connect({ connector });
      if (!address || !chainId)
        throw new Error("Connection failed: No address or chainId");
      return { address, chainId };
    },
    onMutate: () => setWalletState("connecting"),
    onSuccess: () => {
      setWalletState("signing");
      toast.success("Wallet connected", {
        description: "Please sign to verify.",
      });
      verifyMutation.mutate();
    },
    onError: (error) => {
      setWalletState("failed");
      toast.error("Connection failed", { description: error.message });
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async () => {
      if (!address || !chainId) throw new Error("No address or chainId");
      const { data } = await client.query({ query: NonceDocument });
      const nonce = data?.nonce;
      if (!nonce) throw new Error("Failed to fetch nonce");

      const message = createSiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });

      const signature = await signMessageAsync({ message });
      const { data: verifyData } = await client.mutate({
        mutation: VerifyDocument,
        variables: { message, signature },
      });

      const { accessToken, refreshToken } = verifyData.verify;
      if (!accessToken || !refreshToken) throw new Error("Verification failed");

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

      dispatch(connectWalletRedux({ token: accessToken }));
      return { accessToken, refreshToken };
    },
    onMutate: () => setWalletState("signing"),
    onSuccess: () => {
      console.log("verifyMutation: Success, setting authenticated");
      setWalletState("authenticated");
      toast.success("Wallet verified");
      queryClient.setQueryData(["walletState"], "authenticated");
    },
    onError: (error) => {
      setWalletState("failed");
      toast.error("Verification failed", { description: error.message });
    },
  });

  const connectWallet = (walletId: string) => connectMutation.mutate(walletId);

  const disconnectWallet = () => {
    disconnect();
    setWalletState("disconnected");
    Cookies.remove("auth_token");
    Cookies.remove("refresh_token");
    dispatch(disconnectWalletRedux());
    queryClient.setQueryData(["walletState"], "disconnected");
  };

  // Hàm switchNetwork trả về Promise<boolean> để xử lý kết quả
  const switchNetwork = async (chainId: number): Promise<boolean> => {
    try {
      await switchChain({ chainId });
      return true; // Thành công
    } catch (error) {
      console.error("Switch chain failed:", error);
      return false; // Thất bại
    }
  };

  const isAuthenticated =
    walletState === "authenticated" && !!Cookies.get("auth_token");

  console.log("useWallet: Current state", {
    walletState,
    isAuthenticated,
    isConnected,
    chainId,
    balance: balanceData?.formatted,
  });

  return {
    address,
    chainId,
    isConnected,
    walletState,
    isConnecting: connectMutation.isPending,
    isSigning: verifyMutation.isPending,
    isAuthenticated,
    connectWallet,
    disconnectWallet,
    walletBalance: balanceData?.formatted,
    walletBalanceSymbol: balanceData?.symbol,
    isBalanceLoading,
    currentChain: getChainById(chainId),
    supportedChains,
    switchNetwork, // Trả về hàm async thay vì biểu thức điều kiện
    isSwitchingChain,
  };
}
