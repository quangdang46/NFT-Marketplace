"use client";

import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import NFTCard from "./NFTCard";
import { cn } from "@/lib/utils";
import type { NFT } from "@/types/nft";

interface NFTGridProps {
  nfts: NFT[];
  view: "grid" | "compact";
  showFilters: boolean;
  isSliding: boolean;
  onSelect: (id: string) => void;
}

export default function NFTGrid({
  nfts,
  view,
  showFilters,
  isSliding,
  onSelect,
}: NFTGridProps) {
  return (
    <div
      className={cn(
        "grid gap-3 transition-all duration-300 ease-in-out",
        view === "compact"
          ? showFilters
            ? "grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7"
            : "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9"
          : showFilters
          ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7"
      )}
    >
      <div className="bg-muted/20 rounded-lg overflow-hidden border">
        <div className="p-4 flex flex-col items-center justify-center">
          <Zap className="h-8 w-8 mb-2" />
          <div className="text-xl font-bold">Instant Sell</div>
          <div className="text-2xl font-bold mb-4">0.023 BTC</div>
          <Button className="w-full bg-pink-600 hover:bg-pink-700">
            Sell Now
          </Button>
          <Button variant="ghost" className="w-full mt-2">
            View All Offers
          </Button>
        </div>
      </div>

      {nfts.map((nft) => (
        <NFTCard
          key={nft.id}
          nft={nft}
          compact={view === "compact"}
          isSliding={isSliding}
          onSelect={() => onSelect(nft.id)}
        />
      ))}
    </div>
  );
}
