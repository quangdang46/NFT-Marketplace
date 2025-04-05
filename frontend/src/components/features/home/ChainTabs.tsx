

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Globe } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { mockChains } from "@/lib/constant/chains";
import { cn } from "@/lib/utils";

export function ChainTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedChain, setSelectedChain] = useState<string | number>("all");
  const isMobile = useIsMobile();

  // Đồng bộ giá trị selectedChain với tham số URL khi component mount
  useEffect(() => {
    const chainParam = searchParams.get("chain");
    if (chainParam) {
      setSelectedChain(chainParam);
    }
  }, [searchParams]);

  const handleChainChange = (chainId: number | string) => {
    setSelectedChain(chainId);

    // Cập nhật URL với tham số tìm kiếm
    const params = new URLSearchParams(searchParams.toString());
    params.set("chain", chainId + "");
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="fixed left-0 right-0 top-[50px] md:top-[65px] xl:top-[60px] z-40 bg-white dark:bg-[#121620] border-b border-gray-200 dark:border-white/5 transition-colors">
      <div className="container mx-auto py-3">
        {isMobile ? (
          <div className="bg-gray-50 dark:bg-[#1A1F2C] rounded-lg p-2">
            <select
              value={selectedChain}
              onChange={(e) => handleChainChange(e.target.value)}
              className="w-full bg-white dark:bg-[#232836] border border-gray-200 dark:border-white/10 rounded-lg p-3 text-gray-900 dark:text-white focus:ring-primary focus:border-primary transition-colors"
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
          <div className="flex space-x-1 overflow-x-auto">
            <div
              key="all"
              onClick={() => handleChainChange("all")}
              className={cn(
                "flex items-center h-10 px-3 rounded-lg cursor-pointer transition-colors",
                selectedChain === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-[#1A1F2C] dark:text-white/70 dark:hover:bg-[#232836]"
              )}
            >
              <Globe size={18} />
              <span
                className={cn(
                  "ml-2 text-sm font-medium transition-opacity duration-150",
                  selectedChain === "all"
                    ? "opacity-100"
                    : "opacity-0 w-0 overflow-hidden"
                )}
              >
                All Chains
              </span>
            </div>

            {mockChains.map((chain) => (
              <div
                key={chain.id}
                onClick={() => handleChainChange(chain.id)}
                className={cn(
                  "flex items-center h-10 px-3 rounded-lg cursor-pointer transition-colors",
                  String(selectedChain) === String(chain.id)
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-[#1A1F2C] dark:text-white/70 dark:hover:bg-[#232836]"
                )}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor:
                      String(chain.id) === String(selectedChain)
                        ? "rgba(255, 255, 255, 0.2)"
                        : "transparent",
                  }}
                >
                  {chain.icon}
                </div>
                <span
                  className={cn(
                    "ml-2 text-sm font-medium transition-opacity duration-150",
                    String(chain.id) === String(selectedChain)
                      ? "opacity-100"
                      : "opacity-0 w-0 overflow-hidden"
                  )}
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

