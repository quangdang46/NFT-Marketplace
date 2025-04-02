"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { HomeBanner } from "./HomeBanner";
import { mockChains } from "../../../data/mockData";
import { toast } from "sonner";
import client from "@/lib/api/apolloClient";
import {
  Collection,
  GetCollectionsDocument,
  Stats,
} from "@/lib/api/graphql/generated";
export function HomeContent() {
  const searchParams = useSearchParams();
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  // const [viewMode, setViewMode] = useState<"grid" | "list" | "compact">("grid");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [stats, setStats] = useState<Stats>({
    artworks: 0,
    artists: 0,
    collectors: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const chainParam = searchParams.get("chain");
    if (chainParam === "all" || !chainParam) {
      setSelectedChain(null);
    } else if (mockChains.some((chain) => chain.id === chainParam)) {
      setSelectedChain(chainParam);
    } else {
      setSelectedChain(null);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCollections = async () => {
      setIsLoading(true);
      try {
        const { data } = await client.query({
          query: GetCollectionsDocument,
          variables: { chain: selectedChain },
          fetchPolicy: "network-only",
        });
        setCollections(data.collections || []);
        setStats(data.stats || { artworks: 0, artists: 0, collectors: 0 });
      } catch (error) {
        toast.error("Failed to load collections", {
          description: (error as Error).message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, [selectedChain]);
  console.log("collections", collections);
  console.log("stats", stats);
  return (
    <div className="pt-4">
      <HomeBanner stats={stats} chain={selectedChain} />
      {/* <CarouselNFT ></CarouselNFT>
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
