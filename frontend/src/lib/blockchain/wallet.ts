import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

const config = getDefaultConfig({
  appName: process.env.NEXT_PROJECT_NAME as string,
  projectId:
    process.env.NEXT_PUBLIC_PROJECT_ID || "5294ce30dc3d46bfcfda723cd14894ed",
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

export { config };
