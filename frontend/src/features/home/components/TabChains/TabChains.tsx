"use client";
import { BrickWall, GalleryVerticalEnd, Wallet } from "lucide-react";
import DesktopTabs from "./DesktopTabs";
import MobileDropdown from "./MobileDropdown";
import { useInfoStore } from "@/store/infoStore";

const chains = [
  { name: "All", icon: GalleryVerticalEnd, href: "/" },
  { name: "Base", icon: BrickWall, href: "/base" },
  { name: "Ethereum", icon: Wallet, href: "/ethereum" },
];

export default function TabChains() {
  const activeChain = useInfoStore((state) => state.chain);
  return (
    <div className="w-full bg-gray-100 dark:bg-[#120C18]">
      <DesktopTabs chains={chains} activeChain={activeChain} />
      <MobileDropdown chains={chains} activeChain={activeChain} />
    </div>
  );
}
