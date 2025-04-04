import { sepolia, polygonMumbai, baseSepolia, Chain } from "wagmi/chains";
import { createConfig, http } from "wagmi";
import { metaMask } from "wagmi/connectors";

export function getChainById(chainId?: number): Chain | undefined {
  if (!chainId) return undefined;
  return supportedChains.find((chain) => chain.id === chainId);
}

export function getChainIconUrl(chainId: number): string {
  switch (chainId) {
    case sepolia.id:
      return "/images/chains/sepolia.svg";
    case polygonMumbai.id:
      return "/images/chains/polygon.svg";
    case baseSepolia.id:
      return "/images/chains/base.svg";
    default:
      return "/images/chains/default.svg";
  }
}

export const chainColors: Record<number, string> = {
  [sepolia.id]: "#CFB5F0",
  [polygonMumbai.id]: "#8247E5",
  [baseSepolia.id]: "#0052FF",
};

export function getChainName(chainId: number): string | undefined {
  const chain = supportedChains.find((chain) => chain.id === chainId);
  return chain?.name;
}

export const wallets = [
  {
    id: "metaMask",
    name: "MetaMask",
    status: "Installed",
    color: "#E2761B",
    logo: "🦊",
  },
];

export const supportedChains = [sepolia, polygonMumbai, baseSepolia];

// Create wagmi config with improved settings
export const config = createConfig({
  chains: [sepolia, polygonMumbai, baseSepolia],
  transports: {
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
    [polygonMumbai.id]: http(),
  },
  connectors: [metaMask()],
  syncConnectedChain: true,
});

// Enhanced context type
export type WalletModalContextType = {
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  verificationRequired: boolean;
  setVerificationRequired: (required: boolean) => void;
  pendingVerification: boolean;
  setPendingVerification: (pending: boolean) => void;
};
