"use client";
import { BrickWall, GalleryVerticalEnd, Wallet } from "lucide-react";
import DesktopTabs from "./DesktopTabs";
import MobileDropdown from "./MobileDropdown";
import { useNftStore } from "@/store/useNftStore";
import { useParams } from "next/navigation";

const chains = [
  { name: "All", icon: GalleryVerticalEnd, href: "/" },
  { name: "Base", icon: BrickWall, href: "/base" },
  { name: "Ethereum", icon: Wallet, href: "/ethereum" },
];

export default function TabChains() {
  const params = useParams();
  const activeChain = useNftStore((state) => state.selectedBlockchain);

  const currentPath = params?.chain ? `/${params.chain}` : "/";
  const isPathMatched = chains.some((chain) => chain.href === currentPath);

  if (!isPathMatched) {
    return null;
  }
  return (
    <div className="w-full bg-gray-100 dark:bg-[#120C18]">
      <DesktopTabs chains={chains} activeChain={activeChain} />
      <MobileDropdown chains={chains} activeChain={activeChain} />
    </div>
  );
}
