/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useChainId,
  useSwitchChain,
  useSignMessage,
} from "wagmi";
import { createSiweMessage } from "viem/siwe";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  getChainById,
  getChainName,
  supportedChains,
} from "@/lib/blockchain/walletConfig";
import client from "@/lib/api/apolloClient";
import {
  LogoutDocument,
  NonceDocument,
  VerifyDocument,
} from "@/lib/api/graphql/generated";
import {
  connectWalletRedux,
  disconnectWalletRedux,
} from "@/store/slices/authSlice";
import { Address } from "viem";

type ConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "authenticating"
  | "authenticated"
  | "authentication_failed"
  | "switching_chain";

interface WalletBalance {
  formatted: string | null;
  symbol: string | null;
}

// Custom hook để quản lý balance caching
const useWalletBalance = (address?: Address, chainId?: number) => {
  const { data, isLoading, isError, error, refetch } = useBalance({
    address,
    chainId,
    query: {
      enabled: !!address && !!chainId && !!getChainById(chainId),
      staleTime: 10 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      initialData: () => {
        const key = `walletBalance_${address}_${chainId}`;
        const stored = localStorage.getItem(key);
        if (stored) {
          const { value, decimals, symbol } = JSON.parse(stored);
          return {
            value: BigInt(value),
            decimals,
            symbol,
            formatted: (Number(value) / 10 ** decimals).toFixed(4),
          };
        }
        return undefined;
      },
      retry: 3,
      retryDelay: 1000,
    },
  });

  const [cachedBalance, setCachedBalance] = useState<WalletBalance>({
    formatted: null,
    symbol: null,
  });

  useEffect(() => {
    if (data && address && chainId) {
      const formatted = Number.parseFloat(data.formatted).toFixed(4);
      setCachedBalance({ formatted, symbol: data.symbol });
      localStorage.setItem(
        `walletBalance_${address}_${chainId}`,
        JSON.stringify({
          value: data.value.toString(),
          decimals: data.decimals,
          symbol: data.symbol,
        })
      );
    }
    if (isError) {
      toast.error("Failed to load balance", {
        description: error?.message || "Unable to connect to RPC.",
      });
    }
  }, [data, address, chainId, isError, error]);

  return { balance: data, cachedBalance, isLoading, isError, refetch };
};

// Utility để xử lý toast
const showErrorToast = (title: string, description?: string) =>
  toast.error(title, { description });

// Main hook
export function useWallet() {
  const dispatch = useDispatch();
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending: isConnectPending, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitchPending, error: switchError } = useSwitchChain();
  const { signMessageAsync, isPending: isSignPending, error: signError } = useSignMessage();

  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [signatureRejected, setSignatureRejected] = useState(false);
  const [isSwitchingChain, setIsSwitchingChain] = useState(false);
  const authInProgressRef = useRef(false);
  const chainSwitchInProgressRef = useRef(false);

  const { balance, cachedBalance, isLoading: isBalanceLoading, refetch: refetchBalance } =
    useWalletBalance(address, chainId);

  // Utility để update state
  const updateState = useCallback(
    (newState: Partial<{
      connectionState: ConnectionState;
      isAuthenticated: boolean;
      pendingVerification: boolean;
    }>) => {
      if (newState.connectionState) setConnectionState(newState.connectionState);
      if (typeof newState.isAuthenticated === "boolean") setIsAuthenticated(newState.isAuthenticated);
      if (typeof newState.pendingVerification === "boolean") setPendingVerification(newState.pendingVerification);
    },
    []
  );

  // Kiểm tra trạng thái ban đầu
  useEffect(() => {
    const storedAuthenticated = localStorage.getItem("walletAuthenticated") === "true";
    const storedAddress = localStorage.getItem("authenticatedAddress");
    const accessToken = Cookies.get("auth_token");

    if (isConnected && address) {
      if (!accessToken || storedAddress !== address) {
        updateState({ connectionState: "connected", isAuthenticated: false, pendingVerification: true });
        localStorage.removeItem("walletAuthenticated");
        localStorage.removeItem("authenticatedAddress");
        Cookies.remove("auth_token");
        Cookies.remove("refresh_token");
        dispatch(disconnectWalletRedux());
      } else if (storedAuthenticated && storedAddress === address && accessToken) {
        updateState({ connectionState: "authenticated", isAuthenticated: true, pendingVerification: false });
      } else {
        updateState({ connectionState: "connected", isAuthenticated: false, pendingVerification: true });
      }
    } else {
      updateState({ connectionState: "disconnected", isAuthenticated: false, pendingVerification: false });
    }
  }, [isConnected, address, updateState, dispatch]);

  // Kiểm tra chain không hỗ trợ
  useEffect(() => {
    if (isConnected && chainId && !getChainById(chainId)) {
      showErrorToast("Unsupported network", "Please switch to a supported network.");
      setPendingVerification(true);
    }
  }, [chainId, isConnected]);

  // Hàm lấy nonce
  const getNonce = async (): Promise<string> => {
    const { data } = await client.query({ query: NonceDocument });
    if (!data?.nonce) throw new Error("Failed to fetch nonce");
    return data.nonce;
  };

  // Hàm tạo SIWE message
  const createMessage = useCallback(
    ({ nonce, address, chainId }: { nonce: string; address: Address; chainId: number }) =>
      createSiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      }),
    []
  );

  // Hàm verify signature
  const verify = async ({
    message,
    signature,
  }: {
    message: string;
    signature: string;
  }): Promise<boolean> => {
    const { data } = await client.mutate({
      mutation: VerifyDocument,
      variables: { message, signature },
    });
    const { accessToken, refreshToken } = data.verify;
    if (!accessToken || !refreshToken) throw new Error("Invalid tokens received");

    Cookies.set("auth_token", accessToken, { expires: 1 / 24, secure: true, sameSite: "strict" });
    Cookies.set("refresh_token", refreshToken, { expires: 7, secure: true, sameSite: "strict" });
    dispatch(connectWalletRedux({ token: accessToken }));
    return true;
  };

  // Hàm xác thực SIWE
  const authenticateWithSiwe = useCallback(async (): Promise<boolean> => {
    if (!address || !chainId || authInProgressRef.current) return false;
    authInProgressRef.current = true;
    setIsAuthenticating(true);
    setAuthError(null);

    try {
      const nonce = await getNonce();
      const message = createMessage({ nonce, address, chainId });
      const signature = await Promise.race([
        signMessageAsync({ message, account: address }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Authentication timeout")), 10000)),
      ]) as string;
      const isVerified = await verify({ message, signature });

      if (isVerified) {
        updateState({ connectionState: "authenticated", isAuthenticated: true, pendingVerification: false });
        localStorage.setItem("walletAuthenticated", "true");
        localStorage.setItem("authenticatedAddress", address);
        toast.success("Wallet verified");
      } else {
        disconnect();
        showErrorToast("Verification failed, disconnected", "Please reconnect and verify again.");
      }
      return isVerified;
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Authentication failed";
      setAuthError(errMsg);
      if (errMsg.includes("rejected")) {
        setSignatureRejected(true);
        updateState({ connectionState: "connected", pendingVerification: true });
        showErrorToast("Signature rejected", "Please sign to verify your wallet.");
      } else {
        disconnect();
        updateState({ connectionState: "disconnected", isAuthenticated: false, pendingVerification: false });
        showErrorToast("Authentication failed, disconnected", "Please reconnect and verify again.");
      }
      return false;
    } finally {
      setIsAuthenticating(false);
      authInProgressRef.current = false;
    }
  }, [address, chainId, signMessageAsync, updateState, disconnect, createMessage]);

  // Hàm sign out
  const signOut = useCallback(async () => {
    await client.mutate({ mutation: LogoutDocument });
    Cookies.remove("auth_token");
    Cookies.remove("refresh_token");
    dispatch(disconnectWalletRedux());
    localStorage.clear();
    updateState({ connectionState: "disconnected", isAuthenticated: false, pendingVerification: false });
  }, [dispatch, updateState]);

  // Hàm kết nối ví
  const connectWallet = useCallback(
    async (walletId: string): Promise<boolean> => {
      setConnectionState("connecting");
      const connector = connectors.find((c) => c.id === walletId) || connectors.find((c) => c.id === "metaMaskSDK");
      if (!connector) {
        if (walletId === "metaMask" && !window.ethereum) {
          showErrorToast("MetaMask not detected", "Please install MetaMask extension.");
        } else {
          showErrorToast("Wallet not supported", `${walletId} is not available.`);
        }
        setConnectionState("disconnected");
        return false;
      }

      await connect({ connector });
      if (isConnected) {
        updateState({ connectionState: "connected", isAuthenticated: false, pendingVerification: true });
        toast.success("Wallet connected", { description: "Please verify your wallet." });
        const verified = await authenticateWithSiwe();
        if (!verified) {
          disconnect();
          updateState({ connectionState: "disconnected", isAuthenticated: false, pendingVerification: false });
          showErrorToast("Verification required", "Disconnected due to verification failure.");
          return false;
        }
        return true;
      }
      return false;
    },
    [connect, connectors, isConnected, updateState, authenticateWithSiwe, disconnect]
  );

  // Hàm ngắt kết nối
  const disconnectWallet = useCallback(async () => {
    await signOut();
    disconnect();
    updateState({ connectionState: "disconnected", isAuthenticated: false, pendingVerification: false });
  }, [disconnect, signOut, updateState]);

  // Hàm chuyển chain
  const switchNetwork = useCallback(
    async (targetChainId: number): Promise<boolean> => {
      if (!isConnected || chainId === targetChainId || chainSwitchInProgressRef.current) return false;
      chainSwitchInProgressRef.current = true;
      setIsSwitchingChain(true);

      try {
        if (!window.ethereum) throw new Error("No Ethereum provider found");
        const chainIdHex = `0x${targetChainId.toString(16)}`;
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainIdHex }],
        });
        updateState({ connectionState: "connected", isAuthenticated: false, pendingVerification: true });
        refetchBalance();
        toast.success("Network switched", {
          description: `Switched to ${getChainName(targetChainId)}. Please verify again.`,
        });
        return await authenticateWithSiwe();
      } catch (error) {
        showErrorToast("Network switch failed", error instanceof Error ? error.message : "Unknown error");
        try {
          await switchChain({ chainId: targetChainId });
          updateState({ connectionState: "connected", isAuthenticated: false, pendingVerification: true });
          refetchBalance();
          return await authenticateWithSiwe();
        } catch {
          return false;
        }
      } finally {
        setIsSwitchingChain(false);
        chainSwitchInProgressRef.current = false;
      }
    },
    [isConnected, chainId, switchChain, refetchBalance, updateState, authenticateWithSiwe]
  );

  // Memoized return object
  return useMemo(
    () => ({
      address,
      isConnected,
      chainId,
      currentChain: getChainById(chainId),
      walletBalance: isBalanceLoading ? cachedBalance.formatted : balance?.formatted,
      walletBalanceSymbol: isBalanceLoading ? cachedBalance.symbol : balance?.symbol,
      isAuthenticated,
      authError,
      connectionState,
      isAuthenticating,
      isConnectPending,
      isSwitchingChain,
      pendingVerification,
      setPendingVerification,
      signatureRejected,
      connectWallet,
      disconnectWallet,
      switchNetwork,
      authenticateWithSiwe,
      isBalanceLoading,
      isSignPending,
      connectError,
      switchError,
      signError,
      supportedChains,
    }),
    [
      address,
      isConnected,
      chainId,
      balance,
      cachedBalance,
      isAuthenticated,
      authError,
      connectionState,
      isAuthenticating,
      isConnectPending,
      isSwitchingChain,
      pendingVerification,
      signatureRejected,
      connectWallet,
      disconnectWallet,
      switchNetwork,
      authenticateWithSiwe,
      isBalanceLoading,
      isSignPending,
      connectError,
      switchError,
      signError,
    ]
  );
}