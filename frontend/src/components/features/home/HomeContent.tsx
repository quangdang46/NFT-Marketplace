"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FeaturedCollections } from "./FeaturedCollections";
import { TrendingNFTs } from "./TrendingNFTs";
import { HomeBanner } from "./HomeBanner";
import { ViewToggle } from "./ViewToggle";
import { NFTCarousel } from "./NFTCarousel";
import { FeaturedArtists } from "./FeaturedArtists";
import { RecentlySold } from "./RecentlySold";
import { mockChains } from "../../../data/mockData";
import CarouselNFT from "@/components/features/home/CarouselNFT/CarouselNFT";
import NFTCollections from "@/components/features/home/NFTCollections/NFTCollections";
export function HomeContent() {
  const searchParams = useSearchParams();
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "compact">("grid");

  useEffect(() => {
    const chainParam = searchParams.get("chain");
    if (chainParam === "all" || !chainParam) {
      // If "all" is selected or no chain parameter, set to null to show all chains
      setSelectedChain(null);
    } else if (mockChains.some((chain) => chain.id === chainParam)) {
      setSelectedChain(chainParam);
    } else {
      // Default to null (all chains) if invalid chain ID
      setSelectedChain(null);
    }
  }, [searchParams]);

  return (
    <div className="pt-4">
      <HomeBanner />
      <CarouselNFT chainId={selectedChain}></CarouselNFT>
      <NFTCollections chainId={selectedChain} />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-8">
        <h2 className="text-2xl font-bold">Hot Collections</h2>
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      <FeaturedCollections chainId={selectedChain} viewMode={viewMode} />

      <NFTCarousel chainId={selectedChain} />

      <FeaturedArtists />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Trending NFTs</h2>
      </div>

      <TrendingNFTs chainId={selectedChain} viewMode={viewMode} />

      <RecentlySold chainId={selectedChain} />
    </div>
  );
}
