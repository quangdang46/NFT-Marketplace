"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface NFT {
  id: string;
  name: string;
  image: string;
  price: number;
  chain: {
    id: string;
    name: string;
    icon: string;
    symbol: string;
  };
}

interface NFTGridProps {
  collectionId?: string;
  chainId?: string;
}

export function NFTGrid({ collectionId, chainId }: NFTGridProps) {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Reset when props change
    setNfts([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);

    fetchNFTs(1);
  }, [collectionId, chainId]);

  const fetchNFTs = async (pageNum: number) => {
    // Simulating API call
    setTimeout(() => {
      const mockNFTs = Array(12)
        .fill(null)
        .map((_, index) => {
          const chainIndex = chainId
            ? ["solana", "ethereum", "polygon"].indexOf(chainId)
            : Math.floor(Math.random() * 3);

          const finalChainIndex = chainIndex === -1 ? 0 : chainIndex;
          const chainIds = ["solana", "ethereum", "polygon"];
          const chainNames = ["Solana", "Ethereum", "Polygon"];
          const chainSymbols = ["SOL", "ETH", "MATIC"];

          return {
            id: `nft-${(pageNum - 1) * 12 + index}`,
            name: `${collectionId ? `${collectionId} ` : ""}NFT #${
              (pageNum - 1) * 12 + index + 1
            }`,
            image: `https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?150x150`,
            price: 0.1 + Math.random() * 1,
            chain: {
              id: chainIds[finalChainIndex],
              name: chainNames[finalChainIndex],
              icon: "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20",
              symbol: chainSymbols[finalChainIndex],
            },
          };
        });

      setNfts((prev) => (pageNum === 1 ? mockNFTs : [...prev, ...mockNFTs]));
      setLoading(false);
      setHasMore(pageNum < 3); // Simulate 3 pages of data
    }, 1000);
  };

  const loadMore = () => {
    if (!hasMore || loading) return;

    const nextPage = page + 1;
    setPage(nextPage);
    setLoading(true);
    fetchNFTs(nextPage);
  };

  if (loading && nfts.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array(12)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="bg-card rounded-lg overflow-hidden animate-pulse"
            >
              <div className="h-[150px] bg-muted"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {nfts.map((nft) => (
          <Link
            key={nft.id}
            href={`/nfts/${nft.id}`}
            className="bg-card rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
          >
            <div className="relative h-[150px]">
              <Image
                src={
                  nft.image ||
                  "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
                }
                alt={nft.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold truncate">{nft.name}</h3>
                <div className="flex items-center">
                  <Image
                    src={
                      nft.chain.icon ||
                      "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
                    }
                    alt={nft.chain.name}
                    width={16}
                    height={16}
                  />
                </div>
              </div>
              <p className="text-sm font-medium">
                {nft.price.toFixed(2)} {nft.chain.symbol}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {loading && nfts.length > 0 && (
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
