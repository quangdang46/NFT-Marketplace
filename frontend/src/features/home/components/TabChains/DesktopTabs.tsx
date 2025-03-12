"use client";
import ChainItem from "./ChainItem";
import { chains } from "@/lib/constant/chains";

interface DesktopTabsProps {
  activeChain?: string;
}

export default function DesktopTabs({ activeChain }: DesktopTabsProps) {
  return (
    <div className="hidden sm:flex flex-wrap gap-2 items-center">
      {chains.map((chain) => {
        const isActive = activeChain
          ? chain.name.toLowerCase() === activeChain.toLowerCase()
          : chain.href === "/";
        return (
          <ChainItem
            key={chain.href}
            name={chain.name}
            href={chain.href}
            icon={chain.icon}
            isActive={isActive}
          />
        );
      })}
    </div>
  );
}
