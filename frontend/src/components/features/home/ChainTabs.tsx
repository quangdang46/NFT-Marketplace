"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Globe } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { mockChains } from "@/lib/constant/chains";

export function ChainTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedChain, setSelectedChain] = useState<string | number>("all");
  const isMobile = useIsMobile();

  // Check for mobile once on mount and when window resizes

  const handleChainChange = (chainId: number | string) => {
    setSelectedChain(chainId);

    // Update URL with search param
    const params = new URLSearchParams(searchParams.toString());
    params.set("chain", chainId+"");
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="sticky md:top-[85px] xl:top-[60px] z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto py-2">
        {isMobile ? (
          <div className="bg-card rounded-lg p-2">
            <select
              value={selectedChain}
              onChange={(e) => handleChainChange(e.target.value)}
              className="w-full bg-background border-input rounded-lg p-3 text-foreground focus:ring-primary focus:ring-opacity-50"
            >
              <option value="all">All Chains</option>
              {mockChains.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex space-x-1">
            <div
              key="all"
              onClick={() => handleChainChange("all")}
              className={`flex items-center h-10 px-3 rounded-lg transition-all duration-200 cursor-pointer ${
                selectedChain === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-accent"
              }`}
            >
              <Globe size={18} />
              <span
                className={`ml-2 text-sm font-medium transition-all duration-200 ${
                  selectedChain === "all"
                    ? "opacity-100 max-w-24"
                    : "opacity-0 max-w-0 overflow-hidden"
                }`}
              >
                All Chains
              </span>
            </div>

            {mockChains.map((chain) => (
              <div
                key={chain.id}
                onClick={() => handleChainChange(chain.id)}
                className={`flex items-center h-10 px-3 rounded-lg transition-all duration-200 cursor-pointer ${
                  selectedChain === chain.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-accent"
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: `${
                      chain.id == selectedChain ? "#ccc" : "transparent"
                    }`,
                  }}
                >
                  {chain.icon}
                </div>
                <span
                  className={`ml-2 text-sm font-medium transition-all duration-200 ${
                    selectedChain === chain.id
                      ? "opacity-100 max-w-24"
                      : "opacity-0 max-w-0 overflow-hidden"
                  }`}
                >
                  {chain.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
