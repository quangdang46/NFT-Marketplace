import axiosInstance from "@/lib/api/axiosClient";
import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
import { createSiweMessage } from "viem/siwe";
import Cookies from "js-cookie";

export const authenticationAdapter = createAuthenticationAdapter({
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
    try {
      const verifyRes = await axiosInstance.post("/auth/verify", {
        message,
        signature,
      });
      const token = verifyRes?.data?.token;
      if (!token) throw new Error("No token received from server");

      Cookies.set("auth_token", token, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });
      console.log("Kết nối ví thành công:", token);
      return true;
    } catch (error) {
      console.error("Error verifying signature:", error);
      return false;
    }
  },
  signOut: async () => {
    try {
      await axiosInstance.post("/auth/logout");

      Cookies.remove("auth_token", {
        secure: true,
        sameSite: "strict",
      });
      console.log("Đã ngắt kết nối ví");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  },
});
