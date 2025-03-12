import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia, polygonMumbai, baseGoerli } from "wagmi/chains";

const projectId =
  process.env.NEXT_PUBLIC_PROJECT_ID || "5294ce30dc3d46bfcfda723cd14894ed";

export const config = getDefaultConfig({
  appName: "NFT Marketplace",
  chains: [sepolia, polygonMumbai, baseGoerli],
  projectId,
  ssr: true,
});
