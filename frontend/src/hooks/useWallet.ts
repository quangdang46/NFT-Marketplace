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

// Định nghĩa type cho WalletConnectionState
type WalletConnectionState =
  | { status: "disconnected" }
  | { status: "connecting" }
  | { status: "connected"; address: Address; chainId: number }
  | { status: "authenticating"; address: Address; chainId: number }
  | {
      status: "authenticated";
      address: Address;
      chainId: number;
      token: string;
    }
  | { status: "authentication_failed"; error: string }
  | { status: "switching_chain"; targetChainId: number };

interface WalletBalance {
  formatted: string | null;
  symbol: string | null;
}

// Hàm xử lý lỗi tập trung
const handleError = (
  error: unknown,
  defaultMessage: string,
  customDescriptions?: Record<string, string>
): string => {
  const errMsg = error instanceof Error ? error.message : String(error);
  const description = customDescriptions?.[errMsg] || errMsg;
  toast.error(defaultMessage, { description });
  console.log(`Error[${defaultMessage}] ${description}`);
  return errMsg;
};

// Hook quản lý balance caching
const useWalletBalance = (address?: Address, chainId?: number) => {
  const { data, isLoading, isError, error, refetch } = useBalance({
    address,
    chainId,
    query: {
      enabled: !!address && !!chainId && !!getChainById(chainId),
      staleTime: 10 * 60 * 1000, // 10 phút
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
    console.log("useWalletBalance: Checking balance update", {
      address,
      chainId,
      data,
    });
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
      handleError(error, "Failed to load balance", {
        "Unable to connect to RPC": "Cannot connect to blockchain network.",
      });
    }
  }, [data, address, chainId, isError, error]);

  return { balance: data, cachedBalance, isLoading, isError, refetch };
};

// Main hook
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
    signMessageAsync,
    isPending: isSignPending,
    error: signError,
  } = useSignMessage();

  const [state, setState] = useState<WalletConnectionState>({
    status: "disconnected",
  });
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [signatureRejected, setSignatureRejected] = useState(false);
  const authInProgressRef = useRef(false);
  const chainSwitchInProgressRef = useRef(false);

  const {
    balance,
    cachedBalance,
    isLoading: isBalanceLoading,
    refetch: refetchBalance,
  } = useWalletBalance(address, chainId);

  // Kiểm tra trạng thái ban đầu
  useEffect(() => {
    console.log("useEffect: Checking initial state", {
      isConnected,
      address,
      chainId,
    });
    const storedAuthenticated =
      localStorage.getItem("walletAuthenticated") === "true";
    const storedAddress = localStorage.getItem("authenticatedAddress");
    const accessToken = Cookies.get("auth_token");

    if (isConnected && address && chainId) {
      if (!accessToken || storedAddress !== address) {
        console.log("useEffect: Setting connected state, clearing auth");
        setState({ status: "connected", address, chainId });
        localStorage.removeItem("walletAuthenticated");
        localStorage.removeItem("authenticatedAddress");
        Cookies.remove("auth_token");
        Cookies.remove("refresh_token");
        dispatch(disconnectWalletRedux());
        setPendingVerification(true);
      } else if (
        storedAuthenticated &&
        storedAddress === address &&
        accessToken
      ) {
        console.log("useEffect: Setting authenticated state");
        setState({
          status: "authenticated",
          address,
          chainId,
          token: accessToken,
        });
      } else {
        console.log("useEffect: Setting connected state, pending verification");
        setState({ status: "connected", address, chainId });
        setPendingVerification(true);
      }
    } else {
      console.log("useEffect: Setting disconnected state");
      setState({ status: "disconnected" });
      setPendingVerification(false);
    }
  }, [isConnected, address, chainId, dispatch]);

  // Kiểm tra chain không hỗ trợ
  useEffect(() => {
    console.log("useEffect: Checking chain support", { chainId, isConnected });
    if (isConnected && chainId && !getChainById(chainId)) {
      handleError(new Error("Unsupported network"), "Unsupported network", {
        "Unsupported network": "Please switch to a supported network.",
      });
      setPendingVerification(true);
    }
  }, [chainId, isConnected]);

  // Hàm lấy nonce
  const getNonce = async (): Promise<string> => {
    console.log("getNonce: Fetching nonce");
    const { data } = await client.query({ query: NonceDocument });
    if (!data?.nonce) throw new Error("Failed to fetch nonce");
    return data.nonce;
  };

  // Hàm tạo SIWE message
  const createMessage = useCallback(
    ({
      nonce,
      address,
      chainId,
    }: {
      nonce: string;
      address: Address;
      chainId: number;
    }) => {
      console.log("createMessage: Creating SIWE message", {
        nonce,
        address,
        chainId,
      });
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
    console.log("verify: Verifying signature", { message, signature });
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
  };

  // Hàm xác thực SIWE
  const authenticateWithSiwe = useCallback(async (): Promise<boolean> => {
    console.log("authenticateWithSiwe: Starting authentication", {
      address,
      chainId,
    });
    if (!address || !chainId || authInProgressRef.current) {
      console.log(
        "authenticateWithSiwe: Aborted due to invalid state or in progress"
      );
      return false;
    }
    authInProgressRef.current = true;
    setIsAuthenticating(true);

    try {
      const nonce = await getNonce();
      const message = createMessage({ nonce, address, chainId });
      console.log("authenticateWithSiwe: Requesting signature");
      const signature = (await Promise.race([
        signMessageAsync({ message, account: address }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Authentication timeout")), 10000)
        ),
      ])) as string;
      const isVerified = await verify({ message, signature });

      if (isVerified) {
        console.log("authenticateWithSiwe: Verification successful");
        setState({
          status: "authenticated",
          address,
          chainId,
          token: Cookies.get("auth_token")!,
        });
        setPendingVerification(false);
        localStorage.setItem("walletAuthenticated", "true");
        localStorage.setItem("authenticatedAddress", address);
        toast.success("Wallet verified");
      } else {
        console.log("authenticateWithSiwe: Verification failed");
        disconnect();
        setState({ status: "disconnected" });
        handleError(new Error("Verification failed"), "Verification failed", {
          "Verification failed": "Please reconnect and verify again.",
        });
      }
      return isVerified;
    } catch (error) {
      const errMsg = handleError(error, "Authentication failed", {
        "User rejected request":
          "Signature rejected. Please sign to verify your wallet.",
        "Authentication timeout": "Signature request timed out.",
      });
      if (errMsg.includes("rejected")) {
        console.log("authenticateWithSiwe: Signature rejected by user");
        setSignatureRejected(true);
        setState({ status: "connected", address, chainId });
        setPendingVerification(true);
      } else {
        console.log("authenticateWithSiwe: Other error, disconnecting");
        disconnect();
        setState({ status: "disconnected" });
      }
      return false;
    } finally {
      console.log("authenticateWithSiwe: Finished");
      setIsAuthenticating(false);
      authInProgressRef.current = false;
    }
  }, [address, chainId, signMessageAsync, disconnect, createMessage, dispatch]);

  // Hàm sign out
  const signOut = useCallback(async () => {
    console.log("signOut: Signing out");
    await client.mutate({ mutation: LogoutDocument });
    Cookies.remove("auth_token");
    Cookies.remove("refresh_token");
    dispatch(disconnectWalletRedux());
    localStorage.clear();
    setState({ status: "disconnected" });
  }, [dispatch]);

  // Hàm kết nối ví
const connectWallet = useCallback(
  async (walletId: string): Promise<boolean> => {
    console.log("connectWallet: Starting connection", { walletId });
    setState({ status: "connecting" });
    const connector =
      connectors.find((c) => c.id === walletId) ||
      connectors.find((c) => c.id === "metaMaskSDK");
    if (!connector) {
      console.log("connectWallet: Connector not found");
      handleError(
        new Error(`${walletId} not supported`),
        "Wallet not supported",
        {
          "metaMask not supported":
            "MetaMask not detected. Please install MetaMask extension.",
        }
      );
      setState({ status: "disconnected" });
      return false;
    }

    try {
      await connect({ connector });
      if (isConnected && address && chainId) {
        console.log("connectWallet: Wallet connected", { address, chainId });
        setState({ status: "connected", address, chainId });
        toast.success("Wallet connected", {
          description: "Please verify your wallet.",
        });
        const verified = await authenticateWithSiwe();
        if (!verified) {
          console.log("connectWallet: Verification failed");
          // Không disconnect ngay, để người dùng thử lại
          setState({ status: "connected", address, chainId });
          setPendingVerification(true);
          setSignatureRejected(true); // Nếu thất bại do "Cancel"
          return false;
        }
        console.log("connectWallet: Connection and verification successful");
        return true;
      }
      console.log("connectWallet: Connection failed");
      setState({ status: "disconnected" });
      return false;
    } catch (error) {
      console.log("connectWallet: Error during connection", error);
      handleError(error, "Connection failed");
      setState({ status: "disconnected" });
      return false;
    }
  },
  [
    connect,
    connectors,
    isConnected,
    address,
    chainId,
    authenticateWithSiwe,
    disconnect,
  ]
);

  // Hàm ngắt kết nối
  const disconnectWallet = useCallback(async () => {
    console.log("disconnectWallet: Disconnecting");
    await signOut();
    disconnect();
    setState({ status: "disconnected" });
    setPendingVerification(false);
  }, [disconnect, signOut]);

  // Hàm chuyển chain
  const switchNetwork = useCallback(
    async (targetChainId: number): Promise<boolean> => {
      console.log("switchNetwork: Starting chain switch", { targetChainId });
      if (
        !isConnected ||
        chainId === targetChainId ||
        chainSwitchInProgressRef.current
      ) {
        console.log(
          "switchNetwork: Aborted due to invalid state or in progress"
        );
        return false;
      }
      chainSwitchInProgressRef.current = true;
      setState({ status: "switching_chain", targetChainId });

      try {
        if (!window.ethereum) throw new Error("No Ethereum provider found");
        const chainIdHex = `0x${targetChainId.toString(16)}`;
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainIdHex }],
        });
        console.log("switchNetwork: Chain switched via provider");
        setState({
          status: "connected",
          address: address!,
          chainId: targetChainId,
        });
        setPendingVerification(true);
        refetchBalance();
        toast.success("Network switched", {
          description: `Switched to ${getChainName(
            targetChainId
          )}. Please verify again.`,
        });
        return await authenticateWithSiwe();
      } catch (error) {
        handleError(error, "Network switch failed");
        try {
          console.log("switchNetwork: Falling back to switchChain");
          await switchChain({ chainId: targetChainId });
          setState({
            status: "connected",
            address: address!,
            chainId: targetChainId,
          });
          setPendingVerification(true);
          refetchBalance();
          return await authenticateWithSiwe();
        } catch (innerError) {
          console.log("switchNetwork: Fallback failed");
          handleError(innerError, "Network switch failed via fallback");
          return false;
        }
      } finally {
        console.log("switchNetwork: Finished");
        chainSwitchInProgressRef.current = false;
      }
    },
    [
      isConnected,
      chainId,
      switchChain,
      refetchBalance,
      authenticateWithSiwe,
      address,
    ]
  );

  // Memoized return object
  return useMemo(
    () => ({
      address,
      isConnected,
      chainId,
      currentChain: getChainById(chainId),
      walletBalance: isBalanceLoading
        ? cachedBalance.formatted
        : balance?.formatted,
      walletBalanceSymbol: isBalanceLoading
        ? cachedBalance.symbol
        : balance?.symbol,
      isAuthenticated: state.status === "authenticated",
      authError: state.status === "authentication_failed" ? state.error : null,
      connectionState: state.status,
      isAuthenticating,
      isConnectPending,
      isSwitchingChain: state.status === "switching_chain",
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
      state,
      isAuthenticating,
      isConnectPending,
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
