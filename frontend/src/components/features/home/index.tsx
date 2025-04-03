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
  CollectionApprovedDocument,
  CollectionCreatedDocument,
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

  // Cập nhật selectedChain từ URL
  useEffect(() => {
    const chainParam = searchParams.get("chain");
    console.log("chainParam:", chainParam);
    if (chainParam === "all" || !chainParam) {
      setSelectedChain(null);
    } else if (mockChains.some((chain) => chain.id.toString() === chainParam)) {
      setSelectedChain(chainParam);
    } else {
      setSelectedChain(null);
    }
  }, [searchParams]);

  // Lấy danh sách collections ban đầu
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
        toast.error("Không thể tải collections", {
          description: (error as Error).message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, [selectedChain]);

  // Subscription: Lắng nghe collection mới
  useEffect(() => {
    const subscription = client
      .subscribe({
        query: CollectionCreatedDocument,
        variables: { chainId: selectedChain },
      })
      .subscribe({
        next: ({ data }) => {
          const newCollection = data?.collectionCreated;
          if (newCollection) {
            setCollections((prev) => [newCollection, ...prev]);
            toast.success(`Collection mới: ${newCollection.name}`);
          }
        },
        error: (error) => {
          console.error("Lỗi subscription collectionCreated:", error);
        },
      });

    return () => subscription.unsubscribe();
  }, [selectedChain]);

  // Subscription: Lắng nghe collection được duyệt
  useEffect(() => {
    const subscription = client
      .subscribe({
        query: CollectionApprovedDocument,
        variables: { chainId: selectedChain },
      })
      .subscribe({
        next: ({ data }) => {
          const approvedCollection = data?.collectionApproved;
          if (approvedCollection) {
            setCollections((prev) =>
              prev.map((col) =>
                col.id === approvedCollection.id
                  ? { ...col, status: approvedCollection.status }
                  : col
              )
            );
            toast.success(`Collection được duyệt: ${approvedCollection.name}`);
          }
        },
        error: (error) => {
          console.error("Lỗi subscription collectionApproved:", error);
        },
      });

    return () => subscription.unsubscribe();
  }, [selectedChain]);

  console.log("Collections:", collections);
  console.log("Stats:", stats);
  console.log("Đang tải:", isLoading);
  return (
    <div className="pt-4">
      <ul>
      {collections.map((col) => (
        <li key={col.id}>{col.name} - {col.status}</li>
      ))}
    </ul>
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
