"use client";
import { chains } from "@/lib/constant/chains";
import DesktopTabs from "./DesktopTabs";
import MobileDropdown from "./MobileDropdown";
import { useParams, usePathname } from "next/navigation";

export default function TabChains() {
  const params = useParams();
  const pathname = usePathname();

  if (!pathname.startsWith("/explore")) {
    return null;
  }

  const chain = params.chain as string | undefined;

  if (chain && !chains.some((c) => c.href === `/explore/${chain}`)) {
    return null;
  }

  return (
    <div className="w-full bg-gray-100 dark:bg-[#120C18]">
      <DesktopTabs activeChain={params.chain as string} />
      <MobileDropdown activeChain={params.chain as string} />
    </div>
  );
}
