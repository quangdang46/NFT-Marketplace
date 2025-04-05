/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useCallback, useRef } from "react";
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

export function useWallet() {
  const dispatch = useDispatch();
  const { address, isConnected } = useAccount();
  const {
    connect,
    connectors,
    isPending: isConnectPending,
    error: connectError,
  } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const {
    switchChain,
    isPending: isSwitchPending,
    error: switchError,
  } = useSwitchChain();

  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    isError: isBalanceError,
    error: balanceError,
    refetch: refetchBalance,
  } = useBalance({
    address,
    chainId,
    query: {
      enabled: !!address && !!chainId && !!getChainById(chainId),
      staleTime: 10 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      initialData: () => {
        const stored = localStorage.getItem(
          `walletBalance_${address}_${chainId}`
        );
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
  const {
    signMessageAsync,
    isPending: isSignPending,
    error: signError,
  } = useSignMessage();

  const [connectionState, setConnectionState] =
    useState<ConnectionState>("disconnected");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [signatureRejected, setSignatureRejected] = useState(false);
  const [isSwitchingChain, setIsSwitchingChain] = useState(false);
  const authInProgressRef = useRef(false);
  const chainSwitchInProgressRef = useRef(false);
  const [cachedBalance, setCachedBalance] = useState<string | null>(null);
  const [cachedSymbol, setCachedSymbol] = useState<string | null>(null);

  const updateState = useCallback(
    (
      newState: Partial<{
        connectionState: ConnectionState;
        isAuthenticated: boolean;
        pendingVerification: boolean;
      }>
    ) => {
      if (newState.connectionState)
        setConnectionState(newState.connectionState);
      if (typeof newState.isAuthenticated === "boolean")
        setIsAuthenticated(newState.isAuthenticated);
      if (typeof newState.pendingVerification === "boolean")
        setPendingVerification(newState.pendingVerification);
    },
    []
  );

  useEffect(() => {
    if (balanceData && address && chainId) {
      const formattedBalance = Number.parseFloat(balanceData.formatted).toFixed(
        4
      );
      setCachedBalance(formattedBalance);
      setCachedSymbol(balanceData.symbol);
      localStorage.setItem(
        `walletBalance_${address}_${chainId}`,
        JSON.stringify({
          value: balanceData.value.toString(),
          decimals: balanceData.decimals,
          symbol: balanceData.symbol,
        })
      );
    }
    if (isBalanceError) {
      toast.error("Failed to load balance", {
        description:
          balanceError?.message ||
          "Unable to connect to RPC. Please try again.",
      });
    }
  }, [
    balanceData,
    address,
    chainId,
    isBalanceLoading,
    isBalanceError,
    balanceError,
  ]);

  useEffect(() => {
    if (!isConnected) {
      setCachedBalance(null);
      setCachedSymbol(null);
    }
  }, [isConnected]);

  // Kiểm tra trạng thái ban đầu và buộc verify nếu không có token
  useEffect(() => {
    const storedAuthenticated =
      localStorage.getItem("walletAuthenticated") === "true";
    const storedAddress = localStorage.getItem("authenticatedAddress");
    const accessToken = Cookies.get("auth_token");

    if (isConnected && address) {
      // Nếu không có accessToken hoặc address thay đổi, yêu cầu verify lại
      if (!accessToken || storedAddress !== address) {
        updateState({
          connectionState: "connected",
          isAuthenticated: false,
          pendingVerification: true,
        });
        localStorage.removeItem("walletAuthenticated");
        localStorage.removeItem("authenticatedAddress");
        Cookies.remove("auth_token");
        Cookies.remove("refresh_token");
        dispatch(disconnectWalletRedux());
      } else if (
        storedAuthenticated &&
        storedAddress === address &&
        accessToken
      ) {
        updateState({
          connectionState: "authenticated",
          isAuthenticated: true,
          pendingVerification: false,
        });
      } else {
        updateState({
          connectionState: "connected",
          isAuthenticated: false,
          pendingVerification: true,
        });
      }
    } else {
      updateState({
        connectionState: "disconnected",
        isAuthenticated: false,
        pendingVerification: false,
      });
    }
  }, [isConnected, address, updateState, dispatch]);

  useEffect(() => {
    if (isConnected && chainId && !getChainById(chainId)) {
      toast.error("Unsupported network", {
        description: "Please switch to a supported network.",
      });
      setPendingVerification(true);
    }
  }, [chainId, isConnected]);

  const getNonce = async (): Promise<string> => {
    try {
      const { data } = await client.query({ query: NonceDocument });
      if (!data?.nonce) throw new Error("Failed to fetch nonce");
      return data.nonce;
    } catch (error) {
      toast.error("Nonce fetch failed", {
        description: error instanceof Error ? error.message : "Server error",
      });
      throw error;
    }
  };

  const createMessage = ({
    nonce,
    address,
    chainId,
  }: {
    nonce: string;
    address: Address;
    chainId: number;
  }) =>
    createSiweMessage({
      domain: window.location.host,
      address,
      statement: "Sign in with Ethereum to the app.",
      uri: window.location.origin,
      version: "1",
      chainId,
      nonce,
    });

  const verify = async ({
    message,
    signature,
  }: {
    message: string;
    signature: string;
  }): Promise<boolean> => {
    try {
      const { data } = await client.mutate({
        mutation: VerifyDocument,
        variables: { message, signature },
      });
      const { accessToken, refreshToken } = data.verify;
      if (!accessToken || !refreshToken)
        throw new Error("Invalid tokens received");
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
      return true;
    } catch (error) {
      toast.error("Verification failed", {
        description: error instanceof Error ? error.message : "Server error",
      });
      Cookies.remove("auth_token");
      Cookies.remove("refresh_token");
      dispatch(disconnectWalletRedux());
      return false;
    }
  };

  const authenticateWithSiwe = useCallback(async (): Promise<boolean> => {
    if (!address || !chainId || authInProgressRef.current) return false;
    authInProgressRef.current = true;
    setIsAuthenticating(true);
    setAuthError(null);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Authentication timeout")), 10000)
    );

    try {
      const nonce = await getNonce();
      const message = createMessage({ nonce, address, chainId });
      const signature = await Promise.race([
        signMessageAsync({ message, account: address }),
        timeoutPromise,
      ]);
      const isVerified = await verify({
        message,
        signature: signature as string,
      });
      if (isVerified) {
        updateState({
          connectionState: "authenticated",
          isAuthenticated: true,
          pendingVerification: false,
        });
        localStorage.setItem("walletAuthenticated", "true");
        localStorage.setItem("authenticatedAddress", address);
        toast.success("Wallet verified");
      } else {
        disconnect();
        toast.error("Verification failed, disconnected", {
          description: "Please reconnect and verify again.",
        });
      }
      return isVerified;
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : "Authentication failed";
      setAuthError(errMsg);
      if (errMsg.includes("rejected")) {
        setSignatureRejected(true);
        updateState({
          connectionState: "connected",
          pendingVerification: true,
        });
        toast.error("Signature rejected", {
          description: "Please sign to verify your wallet.",
        });
      } else {
        disconnect();
        updateState({
          connectionState: "disconnected",
          isAuthenticated: false,
          pendingVerification: false,
        });
        toast.error("Authentication failed, disconnected", {
          description: "Please reconnect and verify again.",
        });
      }
      return false;
    } finally {
      setIsAuthenticating(false);
      authInProgressRef.current = false;
    }
  }, [address, chainId, signMessageAsync, updateState, disconnect]);

  const signOut = useCallback(async () => {
    try {
      await client.mutate({ mutation: LogoutDocument });
      Cookies.remove("auth_token");
      Cookies.remove("refresh_token");
      dispatch(disconnectWalletRedux());
      localStorage.clear();
      updateState({
        connectionState: "disconnected",
        isAuthenticated: false,
        pendingVerification: false,
      });
    } catch (error) {
      toast.error("Sign out failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }, [dispatch, updateState]);

  const connectWallet = useCallback(
    async (walletId: string): Promise<boolean> => {
      try {
        setConnectionState("connecting");
        const connector =
          connectors.find((c) => c.id === walletId) ||
          connectors.find((c) => c.id === "metaMaskSDK");
        if (!connector) {
          if (walletId === "metaMask" && !window.ethereum) {
            toast.error("MetaMask not detected", {
              description: "Please install MetaMask extension.",
            });
            throw new Error("MetaMask not detected");
          }
          toast.error("Wallet not supported", {
            description: `${walletId} is not available.`,
          });
          throw new Error("Wallet not supported");
        }

        await connect({ connector });
        if (isConnected) {
          updateState({
            connectionState: "connected",
            isAuthenticated: false, // Buộc verify lại mỗi khi connect
            pendingVerification: true,
          });
          toast.success("Wallet connected", {
            description: "Please verify your wallet.",
          });
          const verified = await authenticateWithSiwe();
          if (!verified) {
            disconnect();
            updateState({
              connectionState: "disconnected",
              isAuthenticated: false,
              pendingVerification: false,
            });
            toast.error("Verification required", {
              description: "Disconnected due to verification failure.",
            });
            return false;
          }
          return true;
        }
        return false;
      } catch (error) {
        const errMsg =
          error instanceof Error ? error.message : "Connection failed";
        toast.error("Connection failed", { description: errMsg });
        updateState({ connectionState: "disconnected" });
        return false;
      }
    },
    [
      connect,
      connectors,
      isConnected,
      updateState,
      authenticateWithSiwe,
      disconnect,
    ]
  );

  const disconnectWallet = useCallback(async () => {
    try {
      await signOut();
      disconnect();
      updateState({
        connectionState: "disconnected",
        isAuthenticated: false,
        pendingVerification: false,
      });
    } catch (error) {
      toast.error("Disconnect failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }, [disconnect, signOut, updateState]);

  const switchNetwork = useCallback(
    async (targetChainId: number): Promise<boolean> => {
      if (
        !isConnected ||
        chainId === targetChainId ||
        chainSwitchInProgressRef.current
      )
        return false;
      chainSwitchInProgressRef.current = true;
      setIsSwitchingChain(true);

      try {
        if (!window.ethereum) throw new Error("No Ethereum provider found");
        const chainIdHex = `0x${targetChainId.toString(16)}`;
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainIdHex }],
        });
        updateState({
          connectionState: "connected",
          isAuthenticated: false, // Buộc verify lại sau khi switch
          pendingVerification: true,
        });
        refetchBalance();
        toast.success("Network switched", {
          description: `Switched to ${getChainName(
            targetChainId
          )}. Please verify again.`,
        });
        const verified = await authenticateWithSiwe();
        return verified;
      } catch (error) {
        toast.error("Network switch failed", {
          description: error instanceof Error ? error.message : "Unknown error",
        });
        try {
          await switchChain({ chainId: targetChainId });
          updateState({
            connectionState: "connected",
            isAuthenticated: false,
            pendingVerification: true,
          });
          refetchBalance();
          const verified = await authenticateWithSiwe();
          return verified;
        } catch {
          return false;
        }
      } finally {
        setIsSwitchingChain(false);
        chainSwitchInProgressRef.current = false;
      }
    },
    [
      isConnected,
      chainId,
      switchChain,
      refetchBalance,
      updateState,
      authenticateWithSiwe,
    ]
  );

  const formattedBalance = balanceData
    ? Number.parseFloat(balanceData.formatted).toFixed(4)
    : null;
  const getFallbackBalance = () => {
    if (isBalanceError && address && chainId) {
      const stored = localStorage.getItem(
        `walletBalance_${address}_${chainId}`
      );
      if (stored) {
        const { value, decimals } = JSON.parse(stored);
        return Number(value) / 10 ** decimals.toFixed(4);
      }
    }
    return null;
  };

  return {
    address,
    isConnected,
    chainId,
    currentChain: getChainById(chainId),
    walletBalance: isBalanceLoading
      ? cachedBalance || getFallbackBalance()
      : balanceData
      ? formattedBalance
      : getFallbackBalance(),
    walletBalanceSymbol: isBalanceLoading ? cachedSymbol : balanceData?.symbol,
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
  };
}
