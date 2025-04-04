import { sepolia, polygonMumbai, baseSepolia, Chain } from "wagmi/chains";
import { createConfig, http } from "wagmi";
import { metaMask } from "wagmi/connectors"; // Đảm bảo import từ "wagmi/connectors", không phải SDK

export const supportedChains: Chain[] = [
  {
    ...sepolia,
    rpcUrls: {
      default: { http: ["https://rpc.sepolia.org"] },
      public: { http: ["https://rpc.sepolia.org"] },
    },
    blockExplorers: {
      default: { name: "Etherscan", url: "https://sepolia.etherscan.io" },
    },
  },
  {
    ...polygonMumbai,
    rpcUrls: {
      default: { http: ["https://rpc-mumbai.maticvigil.com"] },
      public: { http: ["https://rpc-mumbai.maticvigil.com"] },
    },
    blockExplorers: {
      default: { name: "PolygonScan", url: "https://mumbai.polygonscan.com" },
    },
  },
  {
    ...baseSepolia,
    rpcUrls: {
      default: { http: ["https://sepolia.base.org"] },
      public: { http: ["https://sepolia.base.org"] },
    },
    blockExplorers: {
      default: { name: "BaseScan", url: "https://sepolia.basescan.org" },
    },
  },
];

export const chainColors: Record<number, string> = {
  [sepolia.id]: "#CFB5F0",
  [polygonMumbai.id]: "#8247E5",
  [baseSepolia.id]: "#0052FF",
};

export const getChainById = (chainId?: number): Chain | undefined =>
  chainId ? supportedChains.find((chain) => chain.id === chainId) : undefined;

export const getChainName = (chainId: number): string =>
  getChainById(chainId)?.name ?? "Unknown Network";

export const wallets = [
  {
    id: "metaMask",
    name: "MetaMask",
    status: "Installed",
    color: "#E2761B",
    logo: "🦊",
  },
];

export const config = createConfig({
  chains: [sepolia, polygonMumbai, baseSepolia],
  transports: {
    [sepolia.id]: http("https://rpc.sepolia.org"),
    [polygonMumbai.id]: http("https://rpc-mumbai.maticvigil.com"),
    [baseSepolia.id]: http("https://sepolia.base.org"),
  },
  connectors: [metaMask()], // Đảm bảo chỉ dùng metaMask() từ "wagmi/connectors"
  syncConnectedChain: true,
});

export type WalletModalContextType = {
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  pendingVerification: boolean;
  setPendingVerification: (value: boolean) => void;
};
