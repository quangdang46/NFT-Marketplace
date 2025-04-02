"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { HomeBanner } from "./HomeBanner";
import { mockChains } from "@/lib/constant/chains";
import { toast } from "sonner";
import client from "@/lib/api/apolloClient";
import {
  Collection,
  Stats,
  GetCollectionsDocument,
} from "@/lib/api/graphql/generated";
export function HomeContent() {
  const searchParams = useSearchParams();
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [stats, setStats] = useState<Stats>({
    artworks: 0,
    artists: 0,
    collectors: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const chainParam = searchParams.get("chain");
    console.log("chainParam:", chainParam); // Debug giá trị từ URL
    if (chainParam === "all" || !chainParam) {
      setSelectedChain(null);
    } else if (mockChains.some((chain) => chain.id.toString() === chainParam)) {
      setSelectedChain(chainParam);
    } else {
      setSelectedChain(null);
    }
    console.log("selectedChain:", selectedChain); // Debug giá trị sau khi set
  }, [searchParams]);

  useEffect(() => {
    const fetchCollections = async () => {
      setIsLoading(true);
      try {
        const { data } = await client.query({
          query: GetCollectionsDocument,
          variables: { chainId: selectedChain },
          fetchPolicy: "network-only",
        });
        setCollections(data.getCollections.collections || []);
        setStats(
          data.getCollections.stats || {
            artworks: 0,
            artists: 0,
            collectors: 0,
          }
        );
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
  console.log(collections);
  console.log(stats);
  console.log(isLoading);
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
