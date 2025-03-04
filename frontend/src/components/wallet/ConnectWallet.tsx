import { client } from "@/lib/blockchain/thirdweb";
import { useApolloClient } from "@apollo/client";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import Cookies from "js-cookie";
import { queryClient } from "@/lib/api/reactQueryClient";
import { signMessage } from "thirdweb/utils";
import axiosInstance from "@/lib/api/axiosClient";
import { ethers } from "ethers";
import { toast } from "sonner";
const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("com.okex.wallet"),
  createWallet("com.bitget.web3"),
];

export default function ConnectWallet() {
  const apolloClient = useApolloClient();
  const account = useActiveAccount();
  const generateNonce = async (address: string) => {
    const {
      data: { nonce },
    } = await axiosInstance.get(`/auth/get-nonce?address=${address}`);
    return nonce;
  };

  const createMessage = (address: string, nonce: string): string => {
    return `Please sign this message to confirm your identity. Address: ${address}, Nonce: ${nonce}`;
  };
  const { mutate: connectWallet } = useMutation({
    mutationFn: async () => {
      if (!account) {
        throw new Error(
          "Không tìm thấy tài khoản ví. Vui lòng kết nối ví trước."
        );
      }
      if (!ethers.utils.isAddress(account.address)) {
        throw new Error("Ví không hợp lệ.");
      }
      const nonce = await generateNonce(account?.address as string);
      const message = createMessage(account?.address as string, nonce);
      const signature = await signMessage({ message, account });
      const response = await axiosInstance.post("/auth/connect-wallet", {
        address: account?.address,
        message,
        signature,
        nonce,
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Kết nối ví thành công:", data);
      // Lưu token vào cookie
      Cookies.set("auth_token", data.token, {
        expires: 1, // Hết hạn sau 1 ngày
        secure: true, // Chỉ gửi qua HTTPS
        sameSite: "strict", // Ngăn chặn CSRF
      });
      // Cập nhật trạng thái React Query và Apollo Client
      queryClient.invalidateQueries({ queryKey: ["user"] });
      apolloClient.resetStore(); // Reset Apollo Client cache
    },
    onError: (error) => {
      console.error("Lỗi khi kết nối ví:", error);
      toast("Loi khi ket noi vi", {
        description: "Xay ra loi khi ket noi vi",
      });
    },
  });

  // Sử dụng React Query Mutation để xử lý ngắt kết nối ví
  const { mutate: disconnectWallet } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post("/auth/disconnect-wallet");
    },
    onSuccess: () => {
      console.log("Đã ngắt kết nối ví");
      // Xóa token khỏi cookie
      Cookies.remove("auth_token", {
        secure: true,
        sameSite: "strict",
      });
      // Cập nhật trạng thái React Query và Apollo Client
      queryClient.invalidateQueries({ queryKey: ["user"] });
      apolloClient.resetStore(); // Reset Apollo Client cache
    },
    onError: (error) => {
      console.error("Lỗi khi ngắt kết nối ví:", error);
      toast("Loi khi ngat ket noi vi", {
        description: "Xay ra loi khi ngat ket noi vi",
      });
    },
  });
  return (
    <ConnectButton
      connectButton={{
        style: {
          minWidth:"unset",
          height:"auto",
        },
      }}
      client={client}
      wallets={wallets}
      theme={"dark"}
      connectModal={{ size: "compact" }}
      onConnect={() => {
        connectWallet();
      }}
      onDisconnect={() => {
        console.log("Ví đã ngắt kết nối");
        // Xử lý khi ngắt kết nối ví
        disconnectWallet();
      }}
    />
  );
}
