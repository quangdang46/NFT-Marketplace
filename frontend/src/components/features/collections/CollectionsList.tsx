"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Collection {
  id: string;
  address: string;
  name: string;
  image: string;
  floorPrice: number;
  volume: number;
  chain: {
    id: string;
    name: string;
    icon: string;
    symbol: string;
  };
}

interface CollectionsListProps {
  chainId?: string;
}

export function CollectionsList({ chainId }: CollectionsListProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Reset when chainId changes
    setCollections([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);

    fetchCollections(1);
  }, [chainId]);

  const fetchCollections = async (pageNum: number) => {
    // Simulating API call
    // In a real app, this would be an API call with pagination
    setTimeout(() => {
      const mockCollections = Array(12)
        .fill(null)
        .map((_, index) => {
          const chainIndex = Math.floor(Math.random() * 3);
          const chainIds = ["solana", "ethereum", "polygon"];
          const chainNames = ["Solana", "Ethereum", "Polygon"];
          const chainSymbols = ["SOL", "ETH", "MATIC"];

          // If chainId is specified, only return collections for that chain
          const selectedChainIndex = chainId
            ? chainIds.indexOf(chainId)
            : chainIndex;

          // If chainId is specified but not found, use a default
          const finalChainIndex =
            selectedChainIndex === -1 ? 0 : selectedChainIndex;

          return {
            id: `collection-${(pageNum - 1) * 12 + index}`,
            address: `0x${Math.random()
              .toString(16)
              .substring(2, 10)}...${Math.random()
              .toString(16)
              .substring(2, 6)}`,
            name: `Awesome Collection ${(pageNum - 1) * 12 + index + 1}`,
            image: `https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?200x200`,
            floorPrice: 0.5 + Math.random() * 2,
            volume: 10 + Math.random() * 100,
            chain: {
              id: chainIds[finalChainIndex],
              name: chainNames[finalChainIndex],
              icon: "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20",
              symbol: chainSymbols[finalChainIndex],
            },
          };
        });

      setCollections((prev) =>
        pageNum === 1 ? mockCollections : [...prev, ...mockCollections]
      );
      setLoading(false);
      setHasMore(pageNum < 3); // Simulate 3 pages of data
    }, 1000);
  };

  const loadMore = () => {
    if (!hasMore || loading) return;

    const nextPage = page + 1;
    setPage(nextPage);
    setLoading(true);
    fetchCollections(nextPage);
  };

  if (loading && collections.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array(12)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="bg-card rounded-lg overflow-hidden animate-pulse"
            >
              <div className="h-[200px] bg-muted"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.id}`}
            className="bg-card rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
          >
            <div className="relative h-[200px]">
              <Image
                src={
                  collection.image ||
                  "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
                }
                alt={collection.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold truncate">{collection.name}</h3>
                <div className="flex items-center">
                  <Image
                    src={
                      collection.chain.icon ||
                      "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
                    }
                    alt={collection.chain.name}
                    width={16}
                    height={16}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {collection.address}
              </p>
              <div className="flex justify-between text-sm text-muted-foreground">
                <div>
                  <p>Floor</p>
                  <p className="font-medium">
                    {collection.floorPrice.toFixed(2)} {collection.chain.symbol}
                  </p>
                </div>
                <div>
                  <p>Volume</p>
                  <p className="font-medium">
                    {collection.volume.toFixed(2)} {collection.chain.symbol}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {loading && collections.length > 0 && (
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {hasMore && !loading && (
        <div className="flex justify-center">
          <Button onClick={loadMore} variant="outline">
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
