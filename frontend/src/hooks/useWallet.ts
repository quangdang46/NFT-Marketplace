/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useChainId,
  useSwitchChain,
  useSignMessage,
} from "wagmi";
import { useState, useEffect, useCallback, useRef } from "react";
import { getChainById, supportedChains } from "@/lib/blockchain/walletConfig";
import { useWalletModal } from "@/components/providers/WalletProvider";
import client from "@/lib/api/apolloClient";
import { createSiweMessage } from "viem/siwe";
import {
  LogoutDocument,
  NonceDocument,
  VerifyDocument,
} from "@/lib/api/graphql/generated";
import { Address } from "viem";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import {
  connectWalletRedux,
  disconnectWalletRedux,
} from "@/store/slices/authSlice";

// Define connection states for better tracking
type ConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "authenticating"
  | "authenticated"
  | "authentication_failed"
  | "switching_chain";

export function useWallet() {
  const authRequestInProgress = useRef(false);
  // Get verification status from context
  const { setPendingVerification } = useWalletModal();
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
    switchChain: wagmiSwitchChain,
    isPending: isSwitchPending,
    error: switchError,
  } = useSwitchChain();
  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    refetch: refetchBalance,
  } = useBalance({
    address: address,
    enabled: !!address,
  });
  const {
    signMessageAsync,
    isPending: isSignPending,
    error: signError,
  } = useSignMessage();

  // Enhanced state management
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("disconnected");
  const [lastUsedConnector, setLastUsedConnector] = useState<string | null>(
    null
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [hasRequestedSignature, setHasRequestedSignature] = useState(false);
  const [lastAuthenticatedAddress, setLastAuthenticatedAddress] = useState<
    string | null
  >(null);
  const [lastAuthenticatedChainId, setLastAuthenticatedChainId] = useState<
    number | null
  >(null);
  const [isSwitchingChain, setIsSwitchingChain] = useState(false);
  const [switchChainError, setSwitchChainError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState(Date.now()); // Force re-renders when needed
  const [signaturePopupVisible, setSignaturePopupVisible] = useState(false);
  const [signatureAttempts, setSignatureAttempts] = useState(0);
  const [chainSwitchPopupVisible, setChainSwitchPopupVisible] = useState(false);
  const [chainSwitchAttempts, setChainSwitchAttempts] = useState(0);
  const [targetChainId, setTargetChainId] = useState<number | null>(null);
  const [lastChainSwitchResult, setLastChainSwitchResult] = useState<{
    success: boolean;
    chainId: number | null;
  } | null>(null);
  const [signatureRejected, setSignatureRejected] = useState(false);

  // Refs for tracking state between renders
  const initialLoadRef = useRef(true);
  const authInProgressRef = useRef(false);
  const chainSwitchInProgressRef = useRef(false);
  const chainSwitchAttemptRef = useRef<number>(0);
  const signatureRequestTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const signaturePopupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const chainSwitchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const chainSwitchPopupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const chainVerificationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoAuthTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const localStorageCheckedRef = useRef(false);

  const forceUpdate = useCallback(() => {
    setLastUpdated(Date.now());
  }, []);

  useEffect(() => {
    if (localStorageCheckedRef.current) return;

    try {
      localStorageCheckedRef.current = true;
      const wasAuthenticated =
        localStorage.getItem("walletAuthenticated") === "true";
      const storedAddress = localStorage.getItem("authenticatedAddress");
      const storedChainId = localStorage.getItem("authenticatedChainId");

      // Chỉ tự động xác thực nếu tất cả dữ liệu hợp lệ và chưa đăng xuất
      if (wasAuthenticated && storedAddress && storedChainId && isConnected) {
        setIsAuthenticated(true);
        setHasRequestedSignature(true);
        setLastAuthenticatedAddress(storedAddress);
        setLastAuthenticatedChainId(Number.parseInt(storedChainId, 10));
        setConnectionState("authenticated");
      }
    } catch (error) {
      console.error(
        "Error reading authentication state from localStorage:",
        error
      );
    }
  }, [isConnected]);

  // Auto reconnect on page reload if previously connected
  useEffect(() => {
    if (initialLoadRef.current && !isConnected) {
      try {
        const lastConnectedWallet = localStorage.getItem("lastConnectedWallet");
        if (lastConnectedWallet) {
          const connector = connectors.find(
            (c) => c.id === lastConnectedWallet
          );
          if (connector) {
            connect({ connector });
          }
        }
      } catch (error) {
        console.error("Error reconnecting wallet:", error);
      }
      initialLoadRef.current = false;
    }
  }, [connect, connectors, isConnected]);

  // Update connection state based on wagmi connection status
  useEffect(() => {
    if (isConnected && address) {
      if (
        connectionState === "disconnected" ||
        connectionState === "connecting"
      ) {
        setConnectionState("connected");

        // CRITICAL FIX: Set pending verification state when connected but not authenticated
        if (!isAuthenticated) {
          setPendingVerification(true);
        }

        forceUpdate();
      }
    } else if (!isConnected) {
      if (
        connectionState !== "disconnected" &&
        connectionState !== "connecting"
      ) {
        setConnectionState("disconnected");
        setPendingVerification(false);
        forceUpdate();
      }
    }
  }, [
    isConnected,
    address,
    connectionState,
    chainId,
    forceUpdate,
    isAuthenticated,
    setPendingVerification,
  ]);

  // Update pending verification state based on authentication status
  useEffect(() => {
    if (isConnected) {
      if (isAuthenticated) {
        setPendingVerification(false);
      } else {
        setPendingVerification(true);
      }
    } else {
      setPendingVerification(false);
    }
  }, [isConnected, isAuthenticated, setPendingVerification]);

  // Save connection state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("connectionState", connectionState);
    } catch (error) {
      console.error("Error saving connection state:", error);
    }
  }, [connectionState]);

  // Save last connected wallet to localStorage
  useEffect(() => {
    try {
      if (isConnected && connector) {
        localStorage.setItem("lastConnectedWallet", connector.id);
        setLastUsedConnector(connector.id);
      }
    } catch (error) {
      console.error("Error saving wallet info:", error);
    }
  }, [isConnected, connector]);

  // Refresh balance when chain changes
  useEffect(() => {
    if (isConnected && address) {
      refetchBalance();
    }
  }, [chainId, address, isConnected, refetchBalance]);

  // Check if we need to re-authenticate when address changes
  useEffect(() => {
    if (
      isConnected &&
      address &&
      lastAuthenticatedAddress &&
      address.toLowerCase() !== lastAuthenticatedAddress.toLowerCase()
    ) {
      // Address changed, reset authentication state
      setIsAuthenticated(false);
      setHasRequestedSignature(false);
      setConnectionState("connected");
      setPendingVerification(true);
      localStorage.removeItem("walletAuthenticated");
      localStorage.removeItem("authenticatedAddress");
      localStorage.removeItem("authenticatedChainId");
      setLastAuthenticatedAddress(null);
      setLastAuthenticatedChainId(null);
      forceUpdate();
    }
  }, [
    address,
    isConnected,
    lastAuthenticatedAddress,
    forceUpdate,
    setPendingVerification,
    setIsAuthenticated,
    setHasRequestedSignature,
  ]);

  // Check if we need to re-authenticate when chain changes
  useEffect(() => {
    if (
      isConnected &&
      chainId &&
      lastAuthenticatedChainId &&
      chainId !== lastAuthenticatedChainId
    ) {
      // Chain changed, reset authentication state
      setIsAuthenticated(false);
      setHasRequestedSignature(false);
      setConnectionState("connected");
      setPendingVerification(true);
      localStorage.removeItem("walletAuthenticated");
      localStorage.removeItem("authenticatedAddress");
      localStorage.removeItem("authenticatedChainId");
      setLastAuthenticatedAddress(null);
      setLastAuthenticatedChainId(null);
      forceUpdate();
    }
  }, [
    chainId,
    isConnected,
    lastAuthenticatedChainId,
    forceUpdate,
    setPendingVerification,
    setIsAuthenticated,
    setHasRequestedSignature,
  ]);

  useEffect(() => {
    const autoAuthOnReconnect = async () => {
      if (
        isConnected &&
        address &&
        chainId &&
        !isAuthenticated &&
        !authInProgressRef.current
      ) {
        const storedAddress = localStorage.getItem("authenticatedAddress");
        const storedChainId = localStorage.getItem("authenticatedChainId");
        const wasAuthenticated =
          localStorage.getItem("walletAuthenticated") === "true";

        // Chỉ tự động xác thực nếu chưa đăng xuất trước đó
        if (
          wasAuthenticated &&
          storedAddress &&
          storedChainId &&
          storedAddress.toLowerCase() === address.toLowerCase() &&
          Number.parseInt(storedChainId, 10) === chainId &&
          !initialLoadRef.current // Thêm điều kiện để tránh sau đăng xuất
        ) {
          setIsAuthenticated(true);
          setHasRequestedSignature(true);
          setLastAuthenticatedAddress(address);
          setLastAuthenticatedChainId(chainId);
          setConnectionState("authenticated");
          setPendingVerification(false);
          forceUpdate();
        } else {
          setPendingVerification(true);
        }
      }
    };

    autoAuthOnReconnect();
  }, [
    isConnected,
    address,
    chainId,
    isAuthenticated,
    forceUpdate,
    setPendingVerification,
  ]);

  // Track chain changes to update UI and state
  useEffect(() => {
    // If we're in the middle of a chain switch and the chainId changes
    if (
      chainSwitchInProgressRef.current &&
      targetChainId &&
      chainId === targetChainId
    ) {
      // Update the last chain switch result
      setLastChainSwitchResult({
        success: true,
        chainId: chainId,
      });

      // Reset chain switching state
      setIsSwitchingChain(false);
      setChainSwitchPopupVisible(false);
      chainSwitchInProgressRef.current = false;
      setTargetChainId(null);

      // Clear any pending timeouts
      if (chainSwitchTimeoutRef.current) {
        clearTimeout(chainSwitchTimeoutRef.current);
        chainSwitchTimeoutRef.current = null;
      }

      if (chainSwitchPopupTimeoutRef.current) {
        clearTimeout(chainSwitchPopupTimeoutRef.current);
        chainSwitchPopupTimeoutRef.current = null;
      }

      if (chainVerificationIntervalRef.current) {
        clearInterval(chainVerificationIntervalRef.current);
        chainVerificationIntervalRef.current = null;
      }

      // Force update to reflect the new chain
      forceUpdate();
    }
  }, [chainId, targetChainId, forceUpdate, lastChainSwitchResult]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (signatureRequestTimeoutRef.current) {
        clearTimeout(signatureRequestTimeoutRef.current);
      }
      if (signaturePopupTimeoutRef.current) {
        clearTimeout(signaturePopupTimeoutRef.current);
      }
      if (chainSwitchTimeoutRef.current) {
        clearTimeout(chainSwitchTimeoutRef.current);
      }
      if (chainSwitchPopupTimeoutRef.current) {
        clearTimeout(chainSwitchPopupTimeoutRef.current);
      }
      if (chainVerificationIntervalRef.current) {
        clearInterval(chainVerificationIntervalRef.current);
      }
      if (autoAuthTimeoutRef.current) {
        clearTimeout(autoAuthTimeoutRef.current);
      }
    };
  }, []);

  // SIWE functions - these match the function signatures provided by the user
  const getNonce = async () => {
    try {
      const { data } = await client.query({ query: NonceDocument });
      return data.nonce;
    } catch (error) {
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
  }) => {
    return createSiweMessage({
      domain: window.location.host,
      address,
      statement: "Sign in with Ethereum to the app.",
      uri: window.location.origin,
      version: "1",
      chainId,
      nonce,
    });
  };

  const verify = async ({
    message,
    signature,
  }: {
    message: string;
    signature: string;
  }) => {
    try {
      const { data } = await client.mutate({
        mutation: VerifyDocument,
        variables: { message, signature },
      });
      const { accessToken, refreshToken } = data.verify;
      if (!accessToken || !refreshToken) throw new Error("No tokens received");

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
      console.error("Error verifying signature:", error);
      Cookies.remove("auth_token", { secure: true, sameSite: "strict" });
      Cookies.remove("refresh_token", { secure: true, sameSite: "strict" });
      dispatch(disconnectWalletRedux());
      return false;
    }
  };

  const signOut = async () => {
    await client.mutate({ mutation: LogoutDocument });
    Cookies.remove("auth_token", { secure: true, sameSite: "strict" });
    Cookies.remove("refresh_token", { secure: true, sameSite: "strict" });
    dispatch(disconnectWalletRedux());
    setIsAuthenticated(false);
    setHasRequestedSignature(false);
    setLastAuthenticatedAddress(null);
    setLastAuthenticatedChainId(null);
    setConnectionState("disconnected");
    setPendingVerification(false);
    setSignatureAttempts(0);
    setIsAuthenticating(false);
    setSignaturePopupVisible(false);
    authRequestInProgress.current = false;
    localStorage.clear();
    forceUpdate();
  };

  const authenticateWithSiwe = async () => {
    if (!address || !chainId) {
      return false;
    }

    if (authRequestInProgress.current) {
      return false;
    }

    if (
      isAuthenticated &&
      address.toLowerCase() === lastAuthenticatedAddress?.toLowerCase() &&
      chainId === lastAuthenticatedChainId
    ) {
      setPendingVerification(false);
      forceUpdate(); // Thêm để đảm bảo UI cập nhật
      return true;
    }

    authRequestInProgress.current = true;
    setIsAuthenticating(true);
    setAuthError(null);
    setConnectionState("authenticating");
    setSignaturePopupVisible(true);
    setSignatureAttempts((prev) => prev + 1);
    forceUpdate();

    const authTimeout = setTimeout(() => {
      if (authRequestInProgress.current) {
        setAuthError("Authentication timed out");
        setConnectionState("authentication_failed");
        setIsAuthenticating(false);
        authRequestInProgress.current = false;
        forceUpdate();
      }
    }, 60000);

    try {
      const nonce = await getNonce();
      const message = createMessage({ nonce, address, chainId });
      setHasRequestedSignature(true);

      const signature = await signMessageAsync({ message, account: address });
      const isVerified = await verify({ message, signature });
      if (!isVerified) {
        throw new Error("Signature verification failed");
      }
      setIsAuthenticated(true);
      setConnectionState("authenticated");
      clearTimeout(authTimeout);

      if (isVerified) {
        setIsAuthenticated(true);
        setLastAuthenticatedAddress(address);
        setLastAuthenticatedChainId(chainId);
        setConnectionState("authenticated");
        setPendingVerification(false);
        localStorage.setItem("walletAuthenticated", "true");
        localStorage.setItem("authenticatedAddress", address);
        localStorage.setItem("authenticatedChainId", chainId.toString());
        forceUpdate(); // Gọi forceUpdate để ép re-render
      } else {
        throw new Error("Signature verification failed");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setAuthError(
        error instanceof Error ? error.message : "Authentication failed"
      );
      if (error instanceof Error && error.message.includes("rejected")) {
        setSignatureRejected(true);
        setConnectionState("connected"); // Quay lại trạng thái connected thay vì authentication_failed
      } else {
        setConnectionState("authentication_failed");
      }
      forceUpdate();
      return false;
    } finally {
      authRequestInProgress.current = false;
      setIsAuthenticating(false);
      setSignaturePopupVisible(false);
      clearTimeout(authTimeout);
      forceUpdate();
    }
    return true;
  };

  // Enhanced chain switching function with improved MetaMask popup handling
  const switchNetwork = async (targetChainId: number) => {
    if (!isConnected) {
      return false;
    }

    if (chainId === targetChainId) {
      return true;
    }

    // Prevent multiple chain switch attempts
    if (chainSwitchInProgressRef.current) {
      return false;
    }

    try {
      // Increment attempt counter for debugging
      chainSwitchAttemptRef.current += 1;
      setChainSwitchAttempts((prev) => prev + 1);

      // Set chain switching state
      chainSwitchInProgressRef.current = true;
      setIsSwitchingChain(true);
      setSwitchChainError(null);
      setConnectionState("switching_chain");
      setChainSwitchPopupVisible(false);
      setTargetChainId(targetChainId);

      // Store the current chain ID for comparison later
      const previousChainId = chainId;
      setLastChainSwitchResult({
        success: false,
        chainId: previousChainId,
      });

      forceUpdate();

      // Check if the target chain is supported
      const targetChain = supportedChains.find(
        (chain) => chain.id === targetChainId
      );
      if (!targetChain) {
        throw new Error(`Chain with ID ${targetChainId} is not supported`);
      }

      // Clear any previous errors
      setSwitchChainError(null);

      // CRITICAL FIX: Use setTimeout to ensure UI updates before triggering the wallet popup
      await new Promise((resolve) => setTimeout(resolve, 300));

      // CRITICAL FIX: Set a flag to indicate the chain switch popup should be visible
      setChainSwitchPopupVisible(true);

      // CRITICAL FIX: Try direct ethereum request first with better error handling
      try {
        // Make sure window.ethereum is available
        if (!window.ethereum) {
          throw new Error("No Ethereum provider found");
        }

        // Convert chain ID to hex format with proper padding
        const chainIdHex = `0x${targetChainId.toString(16)}`;

        // Use direct RPC method for better compatibility
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainIdHex }],
        });

        // Clear the popup timeout since the request was successful
        if (chainSwitchPopupTimeoutRef.current) {
          clearTimeout(chainSwitchPopupTimeoutRef.current);
          chainSwitchPopupTimeoutRef.current = null;
        }
      } catch (directError) {
        // Fall back to wagmi switchChain
        try {
          await wagmiSwitchChain({ chainId: targetChainId });
          // Clear the popup timeout since the request was successful
          if (chainSwitchPopupTimeoutRef.current) {
            clearTimeout(chainSwitchPopupTimeoutRef.current);
            chainSwitchPopupTimeoutRef.current = null;
          }
        } catch (switchError) {
          // Handle chain switch specific errors
          throw new Error(
            switchError instanceof Error
              ? switchError.message
              : "Failed to switch chain"
          );
        }
      } finally {
        // Always reset the popup visibility flag after the request
        setChainSwitchPopupVisible(false);
      }

      // CRITICAL FIX: Set up a verification interval to check if the chain actually changed
      let verificationAttempts = 0;
      const maxVerificationAttempts = 20; // 10 seconds total (20 * 500ms)

      // Clear any existing verification interval
      if (chainVerificationIntervalRef.current) {
        clearInterval(chainVerificationIntervalRef.current);
      }

      // Set up a new verification interval
      return new Promise<boolean>((resolve) => {
        chainVerificationIntervalRef.current = setInterval(() => {
          verificationAttempts++;

          // Force update during verification to show loading state
          forceUpdate();

          // Check if the chain has changed to the target chain
          if (chainId === targetChainId) {
            // Clear the interval
            if (chainVerificationIntervalRef.current) {
              clearInterval(chainVerificationIntervalRef.current);
              chainVerificationIntervalRef.current = null;
            }

            // Reset chain switching state
            setIsSwitchingChain(false);
            chainSwitchInProgressRef.current = false;
            setConnectionState("connected");

            // Update the last chain switch result
            setLastChainSwitchResult({
              success: true,
              chainId: targetChainId,
            });

            // Reset authentication state since we switched chains
            setIsAuthenticated(false);
            setHasRequestedSignature(false);
            setPendingVerification(true);
            localStorage.removeItem("walletAuthenticated");
            localStorage.removeItem("authenticatedAddress");
            localStorage.removeItem("authenticatedChainId");
            setLastAuthenticatedAddress(null);
            setLastAuthenticatedChainId(null);

            // Refresh balance after chain switch
            refetchBalance();

            // Force update to reflect the new chain
            forceUpdate();

            // Resolve the promise with success
            resolve(true);
          } else if (verificationAttempts >= maxVerificationAttempts) {
            // Chain switch verification timed out

            // Clear the interval
            if (chainVerificationIntervalRef.current) {
              clearInterval(chainVerificationIntervalRef.current);
              chainVerificationIntervalRef.current = null;
            }

            // Reset chain switching state
            setIsSwitchingChain(false);
            chainSwitchInProgressRef.current = false;
            setConnectionState("connected");

            // Update the last chain switch result
            setLastChainSwitchResult({
              success: false,
              chainId: chainId,
            });

            // Set an error
            setSwitchChainError("Chain switch verification timed out");

            // Force update to reflect the error
            forceUpdate();

            // Resolve the promise with failure
            resolve(false);
          }
        }, 500); // Check every 500ms
      });
    } catch (error) {
      console.error("Chain switch error:", error);
      setSwitchChainError(
        error instanceof Error ? error.message : "Failed to switch chain"
      );
      setConnectionState("connected");
      setIsSwitchingChain(false);
      chainSwitchInProgressRef.current = false;
      setTargetChainId(null);

      // Update the last chain switch result
      setLastChainSwitchResult({
        success: false,
        chainId: chainId,
      });

      forceUpdate();
      return false;
    }
  };

  // CRITICAL FIX: New function to manually trigger chain switch
  // This can be used if the automatic chain switch fails
  const triggerChainSwitch = async (targetChainId: number) => {
    if (!isConnected) {
      return false;
    }

    if (chainSwitchInProgressRef.current) {
      chainSwitchInProgressRef.current = false;
      setIsSwitchingChain(false);

      // Clear any pending timeouts or intervals
      if (chainSwitchTimeoutRef.current) {
        clearTimeout(chainSwitchTimeoutRef.current);
        chainSwitchTimeoutRef.current = null;
      }

      if (chainSwitchPopupTimeoutRef.current) {
        clearTimeout(chainSwitchPopupTimeoutRef.current);
        chainSwitchPopupTimeoutRef.current = null;
      }

      if (chainVerificationIntervalRef.current) {
        clearInterval(chainVerificationIntervalRef.current);
        chainVerificationIntervalRef.current = null;
      }
    }

    // CRITICAL FIX: Try direct method first
    try {
      // Make sure window.ethereum is available
      if (!window.ethereum) {
        throw new Error("No Ethereum provider found");
      }

      // Convert chain ID to hex format
      const chainIdHex = `0x${targetChainId.toString(16)}`;

      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });

      // Wait for the chain to actually change
      const checkChainInterval = setInterval(() => {
        if (window.ethereum) {
          window.ethereum
            .request({ method: "eth_chainId" })
            .then((newChainId: string) => {
              const decimalChainId = Number.parseInt(newChainId, 16);
              if (decimalChainId === targetChainId) {
                clearInterval(checkChainInterval);

                // Update state to reflect successful chain switch
                setIsSwitchingChain(false);
                chainSwitchInProgressRef.current = false;
                setConnectionState("connected");
                setLastChainSwitchResult({
                  success: true,
                  chainId: targetChainId,
                });

                // Force update to reflect the new chain
                forceUpdate();
              }
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch((err: any) => {
              console.log(err);
            });
        }
      }, 500);

      // Set a timeout to clear the interval if it takes too long
      setTimeout(() => {
        clearInterval(checkChainInterval);
      }, 10000);

      return true;
    } catch (error) {
      console.log(error);
      return switchNetwork(targetChainId);
    }
  };

  // Connect wallet function with improved error handling and state management
  const connectWallet = async (walletId: string) => {
    try {
      setConnectionState("connecting");
      setHasRequestedSignature(false); // Reset để yêu cầu chữ ký mới
      forceUpdate();


      const connectorMap: Record<string, string> = {
        metaMask: "metaMaskSDK",
      };

      const actualConnectorId = connectorMap[walletId] || walletId;
      const connector = connectors.find((c) => c.id === actualConnectorId);

      if (!connector) {
        setConnectionState("disconnected");
        forceUpdate();
        return false;
      }

      await connect({ connector });

      if (isConnected) {
        setConnectionState("connected");
        setPendingVerification(true);
        forceUpdate();
        return true;
      } else {
        setConnectionState("disconnected");
        forceUpdate();
        return false;
      }
    } catch (error) {
      console.error("Connection error:", error);
      setConnectionState("disconnected");
      forceUpdate();
      return false;
    }
  };
  // Disconnect wallet function with improved state cleanup
  const disconnectWallet = async () => {
    try {
      if (isAuthenticated) {
        await signOut();
      }
      disconnect();
      setConnectionState("disconnected");
      setPendingVerification(false);
      setLastUsedConnector(null);
      setHasRequestedSignature(false);
      setLastAuthenticatedAddress(null);
      setLastAuthenticatedChainId(null);
      setIsAuthenticated(false); // Reset isAuthenticated
      setIsAuthenticating(false);
      authRequestInProgress.current = false;
      localStorage.clear();
      forceUpdate();
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      forceUpdate();
    }
  };
  // Function to retry authentication after a failure
  const retryAuthentication = async () => {
    if (!isConnected || !address) {
      return false;
    }

    return authenticateWithSiwe();
  };

  const triggerSignatureRequest = async () => {
    if (!isConnected || !address || !chainId) {
      return false;
    }

    if (authInProgressRef.current) {
      return false;
    }

    return authenticateWithSiwe(); // Chỉ gọi authenticateWithSiwe để tránh duplicate
  };

  const currentChain = getChainById(chainId);

  // Map connector IDs to wallet names
  const getWalletNameFromConnector = (connectorId: string | null) => {
    if (!connectorId) return null;

    const walletNames: Record<string, string> = {
      metaMaskSDK: "MetaMask",
    };

    return walletNames[connectorId] || connectorId;
  };

  const connectedWalletName = getWalletNameFromConnector(
    lastUsedConnector || connector?.id
  );

  // Format balance for display
  const formattedBalance = balanceData
    ? Number.parseFloat(balanceData.formatted).toFixed(4)
    : null;

  return {
    // Connection state
    address,
    isConnected,
    chainId,
    currentChain,
    walletBalance: formattedBalance,
    walletBalanceSymbol: balanceData?.symbol,
    connectedWalletName,
    isAuthenticated,
    authError,
    isBalanceLoading,
    isAuthenticating,
    isSignPending,
    hasRequestedSignature,
    lastAuthenticatedAddress,
    lastAuthenticatedChainId,
    connectionState,
    isSwitchingChain,
    switchChainError,
    lastUpdated,
    signaturePopupVisible,
    signatureAttempts,
    chainSwitchPopupVisible,
    chainSwitchAttempts,
    targetChainId,
    lastChainSwitchResult,
    signatureRejected,

    // Actions
    connectWallet,
    disconnectWallet,
    switchNetwork,
    authenticateWithSiwe,
    retryAuthentication,
    triggerSignatureRequest,
    triggerChainSwitch,
    forceUpdate,

    // SIWE functions
    getNonce,
    createMessage,
    verify,
    signOut,

    // Loading states
    isConnectPending,
    isSwitchPending,

    // Resources
    connectors,
    supportedChains,

    // Errors
    connectError,
    switchError,
    signError,
  };
}
