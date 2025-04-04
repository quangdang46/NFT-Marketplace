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
  const { address, isConnected, connector } = useAccount();
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
    refetch: refetchBalance,
  } = useBalance({ address, enabled: !!address });
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

  // Kiểm tra trạng thái ban đầu từ localStorage
  useEffect(() => {
    const wasAuthenticated =
      localStorage.getItem("walletAuthenticated") === "true";
    const storedAddress = localStorage.getItem("authenticatedAddress");
    if (
      wasAuthenticated &&
      storedAddress &&
      isConnected &&
      address === storedAddress
    ) {
      setIsAuthenticated(true);
      setConnectionState("authenticated");
      setPendingVerification(false);
    }
  }, [isConnected, address]);

  // Đồng bộ trạng thái kết nối
  useEffect(() => {
    if (isConnected && address) {
      if (
        connectionState === "disconnected" ||
        connectionState === "connecting"
      ) {
        updateState({
          connectionState: "connected",
          pendingVerification: !isAuthenticated,
        });
      }
    } else if (!isConnected && connectionState !== "disconnected") {
      updateState({
        connectionState: "disconnected",
        pendingVerification: false,
        isAuthenticated: false,
      });
    }
  }, [isConnected, address, connectionState, isAuthenticated, updateState]);

  // Kiểm tra mạng không được hỗ trợ
  useEffect(() => {
    if (isConnected && chainId && !getChainById(chainId)) {
      toast.error("Unsupported network", {
        description: "Please switch to a supported network.",
      });
      setPendingVerification(true);
    }
  }, [chainId, isConnected]);

  // Hàm xử lý SIWE
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
      } else if (errMsg.includes("insufficient funds")) {
        updateState({
          connectionState: "connected",
          pendingVerification: true,
        });
        toast.error("Insufficient funds", {
          description: "You need ETH to sign the message.",
        });
      } else if (errMsg.includes("timeout")) {
        updateState({
          connectionState: "connected",
          pendingVerification: true,
        });
        toast.error("Authentication timeout", {
          description: "Please try again.",
        });
      } else {
        updateState({ connectionState: "authentication_failed" });
      }
      return false;
    } finally {
      setIsAuthenticating(false);
      authInProgressRef.current = false;
    }
  }, [address, chainId, signMessageAsync, updateState]);

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

        // Debug connectors
        console.log(
          "Available connectors:",
          connectors.map((c) => ({ id: c.id, name: c.name }))
        );
        let connector = connectors.find((c) => c.id === walletId);

        // Xử lý trường hợp connector không khớp với walletId
        if (!connector) {
          // Nếu dùng metaMaskSDK nhưng walletId là "metaMask"
          connector = connectors.find((c) => c.id === "metaMaskSDK");
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
        }

        // Thử kết nối, sẽ tự động yêu cầu mở khóa nếu MetaMask bị khóa
        await connect({ connector });
        if (isConnected) {
          updateState({
            connectionState: "connected",
            pendingVerification: true,
          });
          toast.success("Wallet connected", {
            description: "MetaMask connected successfully.",
          });
          return true;
        }
        return false;
      } catch (error) {
        const errMsg =
          error instanceof Error ? error.message : "Connection failed";
        if (errMsg.includes("rejected")) {
          toast.error("Connection rejected", {
            description: "You rejected the connection request in MetaMask.",
          });
        } else {
          toast.error("Connection failed", { description: errMsg });
        }
        updateState({ connectionState: "disconnected" });
        return false;
      }
    },
    [connect, connectors, isConnected, updateState]
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
          isAuthenticated: false,
          pendingVerification: true,
        });
        refetchBalance();
        toast.success("Network switched", {
          description: `Switched to ${getChainName(targetChainId)}`,
        });
        return true;
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
          return true;
        } catch {
          return false;
        }
      } finally {
        setIsSwitchingChain(false);
        chainSwitchInProgressRef.current = false;
      }
    },
    [isConnected, chainId, switchChain, refetchBalance, updateState]
  );

  const formattedBalance = balanceData
    ? Number.parseFloat(balanceData.formatted).toFixed(4)
    : null;

  return {
    address,
    isConnected,
    chainId,
    currentChain: getChainById(chainId),
    walletBalance: formattedBalance,
    walletBalanceSymbol: balanceData?.symbol,
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
