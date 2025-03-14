import Base from "@/components/icons/Base";
import Ethereum from "@/components/icons/Ethereum";
import Polygon from "@/components/icons/Polygon";
import { LucideIcon, Expand } from "lucide-react";
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
  { name: "All", icon: Expand, href: "/collections" },
  { name: "Base", icon: Base, href: "/collections/base" },
  { name: "Ethereum", icon: Ethereum, href: "/collections/ethereum" },
  { name: "Polygon", icon: Polygon, href: "/collections/polygon" },
];
