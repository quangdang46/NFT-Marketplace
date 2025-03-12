import Base from "@/components/icons/Base";
import Ethereum from "@/components/icons/Ethereum";
import Polygon from "@/components/icons/Polygon";
import { AlignJustify, LucideIcon } from "lucide-react";
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
  { name: "All", icon: AlignJustify, href: "/" },
  { name: "Base", icon: Base, href: "/base" },
  { name: "Ethereum", icon: Ethereum, href: "/ethereum" },
  { name: "Polygon", icon: Polygon, href: "/polygon" },
];
