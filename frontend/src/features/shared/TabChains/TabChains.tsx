"use client";
import DesktopTabs from "@/features/shared/TabChains/DesktopTabs";
import MobileDropdown from "@/features/shared/TabChains/MobileDropdown";
import { chains } from "@/lib/constant/chains";
import { useParams, usePathname } from "next/navigation";

export default function TabChains() {
  const params = useParams();
  const pathname = usePathname();

  if (!pathname.startsWith("/collections")) {
    return null;
  }

  const chain = params.chain as string | undefined;

  if (chain && !chains.some((c) => c.href === `/collections/${chain}`)) {
    return null;
  }
  console.log("chain", chain);
  return (
    <div className="w-full bg-gray-100 dark:bg-[#120C18]">
      <DesktopTabs activeChain={chain} />
      <MobileDropdown activeChain={chain} />
    </div>
  );
}
