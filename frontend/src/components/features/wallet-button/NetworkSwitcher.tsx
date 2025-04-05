"use client";

import {
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useWallet } from "@/hooks/useWallet";
import { chainColors, getChainName } from "@/lib/blockchain/walletConfig";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function NetworkSwitcher() {
  const {
    chainId,
    supportedChains,
    switchNetwork,
    isSwitchingChain,
    currentChain,
  } = useWallet();
  const [isOpen, setIsOpen] = useState(false);

  const handleSwitchNetwork = async (targetChainId: number) => {
    if (chainId === targetChainId) return;
    setIsOpen(false);
    const success = await switchNetwork(targetChainId); // Gọi async
    if (success) {
      toast.success("Network switched", {
        description: `Switched to ${getChainName(targetChainId)}`,
      });
    } else {
      toast.error("Network switch failed", {
        description: "Please try again or switch manually in your wallet.",
      });
    }
  };

  return (
    <DropdownMenuSub open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuSubTrigger className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white cursor-pointer">
        <div className="flex items-center">
          <span className="mr-2">Network</span>
          {chainId && (
            <div className="flex items-center text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
              {isSwitchingChain ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin text-blue-500 dark:text-blue-400" />
              ) : (
                <div
                  className="w-2 h-2 rounded-full mr-1"
                  style={{ backgroundColor: chainColors[chainId] || "#888888" }}
                />
              )}
              <span className="text-gray-700 dark:text-gray-300">
                {currentChain ? getChainName(chainId) : "Unsupported"}
              </span>
            </div>
          )}
        </div>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="min-w-[220px] bg-white border border-gray-200 dark:bg-[#1A1F2C] dark:border-white/10">
        {supportedChains.map((chain) => (
          <DropdownMenuItem
            key={chain.id}
            disabled={isSwitchingChain || chainId === chain.id}
            onClick={() => handleSwitchNetwork(chain.id)} // Gọi hàm async
            className={`text-gray-700 dark:text-gray-300 cursor-pointer ${
              chainId === chain.id
                ? "bg-gray-100 dark:bg-gray-800"
                : "hover:bg-gray-50 dark:hover:bg-white/5"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div
                  className="w-4 h-4 mr-2 rounded-full"
                  style={{
                    backgroundColor: chainColors[chain.id] || "#888888",
                  }}
                />
                <span>{chain.name}</span>
              </div>
              {chainId === chain.id && (
                <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
              )}
              {isSwitchingChain && chainId !== chain.id && (
                <Loader2 className="h-4 w-4 animate-spin text-blue-500 dark:text-blue-400" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
