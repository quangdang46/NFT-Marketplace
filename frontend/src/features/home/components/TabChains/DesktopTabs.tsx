"use client";
import { LucideIcon } from "lucide-react";
import ChainItem from "./ChainItem";

interface Chain {
  name: string;
  icon: LucideIcon;
  href: string;
}

interface DesktopTabsProps {
  chains: Chain[];
  activeChain?: string;
}

export default function DesktopTabs({ chains, activeChain }: DesktopTabsProps) {
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
