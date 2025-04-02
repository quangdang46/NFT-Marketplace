import Base from "@/components/icons/Base";
import Ethereum from "@/components/icons/Ethereum";
import Polygon from "@/components/icons/Polygon";
export interface Chain {
  id: number;
  name: string;
  icon: React.ReactNode;
  symbol: string;
}

export const mockChains: Chain[] = [
  // {
  //   id: 84531,
  //   name: "Base Goerli",
  //   icon: <Base />,
  //   symbol: "ETH",
  // },
  {
    id: 11155111,
    name: "Sepolia",
    icon: <Ethereum />,
    symbol: "ETH",
  },
  // {
  //   id: 80001,
  //   name: "Polygon Mumbai",
  //   icon: <Polygon />,
  //   symbol: "ETH",
  // },
];
