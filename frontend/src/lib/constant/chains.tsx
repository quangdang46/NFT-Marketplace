import Base from "@/components/icons/Base";
import Ethereum from "@/components/icons/Ethereum";
import Polygon from "@/components/icons/Polygon";
import { LucideIcon } from "lucide-react";
import { ComponentType } from "react";
type ChainIcon =
  | LucideIcon
  | ComponentType<{ size?: number; className?: string }>;
interface Chain {
  name: string;
  icon: ChainIcon;
  href: string;
}

export const chains: Chain[] = [
  { name: "Base", icon: Base, href: "/explore/base" },
  { name: "Ethereum", icon: Ethereum, href: "/explore/ethereum" },
  { name: "Polygon", icon: Polygon, href: "/explore/polygon" },
];
