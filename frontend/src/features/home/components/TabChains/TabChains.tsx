
"use client";
import { BrickWall, GalleryVerticalEnd, Wallet } from "lucide-react";
import DesktopTabs from "./DesktopTabs";
import MobileDropdown from "./MobileDropdown";

const chains = [
  { name: "All", icon: GalleryVerticalEnd, href: "/" },
  { name: "Base", icon: BrickWall, href: "/base" },
  { name: "Ethereum", icon: Wallet, href: "/ethereum" },
];

interface TabChainsProps {
  activeChain?: string;
}

export default function TabChains({ activeChain }: TabChainsProps) {
  return (
    <div className="w-full bg-gray-100 dark:bg-[#120C18]">
      <DesktopTabs chains={chains} activeChain={activeChain} />
      <MobileDropdown chains={chains} activeChain={activeChain} />
    </div>
  );
}
