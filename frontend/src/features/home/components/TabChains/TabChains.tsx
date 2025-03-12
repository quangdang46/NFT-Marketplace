"use client";
import { chains } from "@/lib/constant/chains";
import DesktopTabs from "./DesktopTabs";
import MobileDropdown from "./MobileDropdown";
import { useNftStore } from "@/store/useNftStore";
import { useParams } from "next/navigation";

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
      <DesktopTabs activeChain={activeChain} />
      <MobileDropdown activeChain={activeChain} />
    </div>
  );
}
