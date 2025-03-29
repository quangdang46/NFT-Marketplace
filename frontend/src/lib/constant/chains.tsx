import Base from "@/components/icons/Base";
import Ethereum from "@/components/icons/Ethereum";
import Polygon from "@/components/icons/Polygon";
export interface Chain {
  id: string;
  name: string;
  icon: React.ReactNode;
  symbol: string;
}

export const mockChains: Chain[] = [
  {
    id: "base",
    name: "Base",
    icon: <Base />,
    symbol: "SOL",
  },
  {
    id: "ethereum",
    name: "Sepolia",
    icon: <Ethereum />,
    symbol: "ETH",
  },
  {
    id: "polygon",
    name: "Polygon",
    icon: <Polygon />,
    symbol: "POLY",
  },
];
