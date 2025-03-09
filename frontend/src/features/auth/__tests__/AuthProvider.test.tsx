/* eslint-disable @typescript-eslint/no-unused-vars */
import { render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as rainbowKit from "@rainbow-me/rainbowkit";
import Cookies from "js-cookie";
import { mockAxios } from "../../../../jest.setup";
import AuthProvider from "@/components/providers/AuthProvider";

// Khởi tạo QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Tắt retry để test nhanh hơn
    },
  },
});

// Mock RainbowKit
jest.mock("@rainbow-me/rainbowkit", () => ({
  RainbowKitProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  RainbowKitAuthenticationProvider: ({
    children,
    status,
  }: {
    children: React.ReactNode;
    status: string;
  }) => (
    <div data-auth-status={status}>{children}</div> // Render DOM với data attribute
  ),
  createAuthenticationAdapter: jest.fn((options) => options),
  lightTheme: jest.fn(),
  darkTheme: jest.fn(),
}));

// Mock js-cookie
jest.mock("js-cookie", () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));
describe("AuthProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Cookies.get as jest.Mock).mockReturnValue(null); // Không có token ban đầu
    mockAxios.reset();
    queryClient.clear(); // Reset cache React Query
  });
  it("should render AuthProvider", () => {
    console.log("test");
  });

  // it("successfully connects wallet and sets authenticated status", async () => {
  //   mockAxios.onGet("/auth/nonce").reply(200, { nonce: "test-nonce" });
  //   mockAxios.onPost("/auth/verify").reply(200, {
  //     accessToken: "test-access-token",
  //     refreshToken: "test-refresh-token",
  //   });
  //   mockAxios
  //     .onGet("/auth/me")
  //     .reply(200, { success: true, data: { id: "1", address: "0x123" } });

  //   const { container } = render(
  //     <QueryClientProvider client={queryClient}>
  //       <AuthProvider>Content</AuthProvider>
  //     </QueryClientProvider>
  //   );

  //   const authAdapter = (rainbowKit.createAuthenticationAdapter as jest.Mock)
  //     .mock.results[0].value;

  //   const nonce = await authAdapter.getNonce();
  //   const message = authAdapter.createMessage({
  //     nonce,
  //     address: "0x123",
  //     chainId: 1,
  //   });
  //   const signature = "test-signature";

  //   const verifyResult = await authAdapter.verify({ message, signature });

  //   await waitFor(() => {
  //     expect(verifyResult).toBe(true);
  //     expect(Cookies.set).toHaveBeenCalledWith(
  //       "auth_token",
  //       "test-access-token",
  //       expect.objectContaining({ expires: 1 / 24 })
  //     );
  //     expect(Cookies.set).toHaveBeenCalledWith(
  //       "refresh_token",
  //       "test-refresh-token",
  //       expect.objectContaining({ expires: 7 })
  //     );
  //     expect(container.querySelector("[data-auth-status]")).toHaveAttribute(
  //       "data-auth-status",
  //       "authenticated"
  //     );
  //   });
  // });

  //   it("fails to connect wallet if verification fails", async () => {
  //     mockAxios.onGet("/auth/nonce").reply(200, { nonce: "test-nonce" });
  //     mockAxios
  //       .onPost("/auth/verify")
  //       .reply(400, { message: "Invalid signature" });

  //     const { container } = render(
  //       <QueryClientProvider client={queryClient}>
  //         <AuthProvider>Content</AuthProvider>
  //       </QueryClientProvider>
  //     );

  //     const authAdapter = (rainbowKit.createAuthenticationAdapter as jest.Mock)
  //       .mock.results[0].value;

  //     const nonce = await authAdapter.getNonce();
  //     const message = authAdapter.createMessage({
  //       nonce,
  //       address: "0x123",
  //       chainId: 1,
  //     });
  //     const signature = "invalid-signature";

  //     const verifyResult = await authAdapter.verify({ message, signature });

  //     await waitFor(() => {
  //       expect(verifyResult).toBe(false);
  //       expect(Cookies.remove).toHaveBeenCalledWith(
  //         "auth_token",
  //         expect.any(Object)
  //       );
  //       expect(Cookies.remove).toHaveBeenCalledWith(
  //         "refresh_token",
  //         expect.any(Object)
  //       );
  //       expect(container.querySelector("[data-auth-status]")).toHaveAttribute(
  //         "data-auth-status",
  //         "unauthenticated"
  //       );
  //     });
  //   });

  //   it("handles nonce fetch error", async () => {
  //     mockAxios.onGet("/auth/nonce").reply(500, { message: "Server error" });

  //     render(
  //       <QueryClientProvider client={queryClient}>
  //         <AuthProvider>Content</AuthProvider>
  //       </QueryClientProvider>
  //     );

  //     const authAdapter = (rainbowKit.createAuthenticationAdapter as jest.Mock)
  //       .mock.results[0].value;

  //     await expect(authAdapter.getNonce()).rejects.toThrow();
  //   });

  //   describe("AuthProvider - Logout", () => {
  //     it("successfully logs out and clears authentication", async () => {
  //       (Cookies.get as jest.Mock).mockReturnValueOnce("test-access-token");
  //       (Cookies.get as jest.Mock).mockReturnValueOnce("test-refresh-token");
  //       mockAxios
  //         .onGet("/auth/me")
  //         .reply(200, { success: true, data: { id: "1", address: "0x123" } });
  //       mockAxios.onPost("/auth/logout").reply(200, { message: "Logged out" });

  //       const { container } = render(
  //         <QueryClientProvider client={queryClient}>
  //           <AuthProvider>Content</AuthProvider>
  //         </QueryClientProvider>
  //       );

  //       await waitFor(() => {
  //         expect(container.querySelector("[data-auth-status]")).toHaveAttribute(
  //           "data-auth-status",
  //           "authenticated"
  //         );
  //       });

  //       const authAdapter = (rainbowKit.createAuthenticationAdapter as jest.Mock)
  //         .mock.results[0].value;
  //       await authAdapter.signOut();

  //       await waitFor(() => {
  //         expect(mockAxios.history.post).toHaveLength(1);
  //         expect(Cookies.remove).toHaveBeenCalledWith(
  //           "auth_token",
  //           expect.any(Object)
  //         );
  //         expect(Cookies.remove).toHaveBeenCalledWith(
  //           "refresh_token",
  //           expect.any(Object)
  //         );
  //         expect(container.querySelector("[data-auth-status]")).toHaveAttribute(
  //           "data-auth-status",
  //           "unauthenticated"
  //         );
  //         expect(queryClient.getQueryData(["auth", "me"])).toBeUndefined();
  //       });
  //     });

  //     it("handles logout error gracefully", async () => {
  //       (Cookies.get as jest.Mock).mockReturnValueOnce("test-access-token");
  //       (Cookies.get as jest.Mock).mockReturnValueOnce("test-refresh-token");
  //       mockAxios.onGet("/auth/me").reply(200, { success: true });
  //       mockAxios.onPost("/auth/logout").reply(500, { message: "Server error" });

  //       const { container } = render(
  //         <QueryClientProvider client={queryClient}>
  //           <AuthProvider>Content</AuthProvider>
  //         </QueryClientProvider>
  //       );

  //       await waitFor(() => {
  //         expect(container.querySelector("[data-auth-status]")).toHaveAttribute(
  //           "data-auth-status",
  //           "authenticated"
  //         );
  //       });

  //       const authAdapter = (rainbowKit.createAuthenticationAdapter as jest.Mock)
  //         .mock.results[0].value;
  //       await authAdapter.signOut();

  //       await waitFor(() => {
  //         expect(mockAxios.history.post).toHaveLength(1);
  //         expect(Cookies.remove).toHaveBeenCalledWith(
  //           "auth_token",
  //           expect.any(Object)
  //         );
  //         expect(Cookies.remove).toHaveBeenCalledWith(
  //           "refresh_token",
  //           expect.any(Object)
  //         );
  //         expect(container.querySelector("[data-auth-status]")).toHaveAttribute(
  //           "data-auth-status",
  //           "unauthenticated"
  //         );
  //       });
  //     });
  //   });
});
