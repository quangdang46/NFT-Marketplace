"use client";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { chains } from "@/lib/constant/chains";

interface MobileDropdownProps {
  activeChain?: string;
}

export default function MobileDropdown({ activeChain }: MobileDropdownProps) {
  const selectedChain = activeChain
    ? chains.find(
        (chain) => chain.name.toLowerCase() === activeChain.toLowerCase()
      ) || { name: "Select Chain", icon: chains[0].icon } // Fallback lấy icon đầu tiên
    : { name: "All", icon: chains[0].icon };

  return (
    <div className="sm:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="rounded-none">
          <Button
            variant="outline"
            className="w-full flex justify-between focus:outline-none"
          >
            <div className="flex items-center gap-2">
              <selectedChain.icon size={20} />
              <span>{selectedChain.name}</span>
            </div>
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[200px]">
          {chains.map((chain) => {
            const isActive = activeChain
              ? chain.name.toLowerCase() === activeChain.toLowerCase()
              : chain.href === "/";
            return (
              <DropdownMenuItem key={chain.href} asChild>
                <Link
                  href={chain.href}
                  className={`flex items-center gap-2 w-full p-2 ${
                    isActive
                      ? "bg-gray-100 text-blue-600 dark:bg-[#40324E] dark:text-white"
                      : "text-gray-700 dark:text-gray-300"
                  } hover:opacity-80`}
                >
                  <chain.icon size={20} />
                  <span>{chain.name}</span>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
