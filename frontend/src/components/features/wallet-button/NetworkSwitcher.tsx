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
      <DropdownMenuSubTrigger>
        <div className="flex items-center">
          <span className="mr-2">Network</span>
          {chainId && (
            <div className="flex items-center text-xs bg-secondary px-2 py-1 rounded-full">
              {isSwitchingChain ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin text-blue-400" />
              ) : (
                <div
                  className="w-2 h-2 rounded-full mr-1"
                  style={{ backgroundColor: chainColors[chainId] || "#888888" }}
                />
              )}
              <span>
                {currentChain ? getChainName(chainId) : "Unsupported"}
              </span>
            </div>
          )}
        </div>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="min-w-[220px]">
        {supportedChains.map((chain) => (
          <DropdownMenuItem
            key={chain.id}
            disabled={isSwitchingChain || chainId === chain.id}
            onClick={() => handleSwitchNetwork(chain.id)} // Gọi hàm async
            className={chainId === chain.id ? "bg-secondary" : ""}
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
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
              {isSwitchingChain && chainId !== chain.id && (
                <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
