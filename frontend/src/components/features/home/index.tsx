"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { HomeBanner } from "./HomeBanner";
import { mockChains } from "@/lib/constant/chains";
import { useHomeData } from "@/hooks/useHomeData";
import CarouselNFT from "@/components/features/home/CarouselNFT/CarouselNFT";
export function HomeContent() {
  const searchParams = useSearchParams();
  const [selectedChain, setSelectedChain] = useState<string | null>(null);

  // Update selectedChain from URL
  useEffect(() => {
    const chainParam = searchParams.get("chain");
    setSelectedChain(
      chainParam === "all" || !chainParam
        ? null
        : mockChains.some((chain) => chain.id.toString() === chainParam)
        ? chainParam
        : null
    );
  }, [searchParams]);

  // Fetch all data
  const { collections, stats } = useHomeData({
    chainId: selectedChain,
  });
  console.log("collections", collections);
  console.log("stats", stats);
  return (
    <div className="pt-4">
      <ul>
        {collections.map((col) => (
          <li key={col.id}>
            {col.name} - {col.status}
          </li>
        ))}
      </ul>
      <HomeBanner stats={stats} chain={selectedChain} />
      <CarouselNFT></CarouselNFT>
      {/* 
      <NFTCollections />
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

      <RecentlySold chainId={selectedChain} /> */}
    </div>
  );
}
