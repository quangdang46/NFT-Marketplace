import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";

const projectId =
  process.env.NEXT_PUBLIC_PROJECT_ID || "5294ce30dc3d46bfcfda723cd14894ed";

export const config = getDefaultConfig({
  appName: "NFT Marketplace",
  chains: [mainnet, polygon, optimism, arbitrum, base],
  projectId,
  ssr: true,
});
