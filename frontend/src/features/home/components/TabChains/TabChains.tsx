"use client";
import { chains } from "@/lib/constant/chains";
import DesktopTabs from "./DesktopTabs";
import MobileDropdown from "./MobileDropdown";
import { useParams } from "next/navigation";

export default function TabChains() {
  const params = useParams();
  if (!params.chain) {
    return null;
  }
  const currentPath = params?.chain ? `/${params.chain}` : "/";
  const isPathMatched = chains.some((chain) => chain.href === currentPath);
  if (!isPathMatched) {
    return null;
  }
  return (
    <div className="w-full bg-gray-100 dark:bg-[#120C18]">
      <DesktopTabs activeChain={params.chain as string} />
      <MobileDropdown activeChain={params.chain as string} />
    </div>
  );
}
