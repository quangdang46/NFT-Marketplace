"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockNFTs } from "../../data/mockData";

interface SoldNFT {
  id: string;
  name: string;
  image: string;
  price: number;
  soldAt: Date;
  buyer: string;
  seller: string;
  chain: {
    id: string;
    name: string;
    icon: string;
    symbol: string;
    color: string;
  };
}

interface RecentlySoldProps {
  chainId: string | null;
}

export function RecentlySold({ chainId }: RecentlySoldProps) {
  const [soldNFTs, setSoldNFTs] = useState<SoldNFT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      // Create mock sold NFTs from the mockNFTs data
      const mockSoldNFTs = mockNFTs.slice(0, 8).map((nft, index) => {
        // Random sold time in the last 24 hours
        const soldAt = new Date();
        soldAt.setHours(soldAt.getHours() - Math.floor(Math.random() * 24));

        return {
          ...nft,
          soldAt,
          buyer: `User${Math.floor(Math.random() * 1000)}`,
          seller: `User${Math.floor(Math.random() * 1000)}`,
        };
      });

      // Filter by chain if needed
      const filtered = chainId
        ? mockSoldNFTs.filter((nft) => nft.chain.id === chainId)
        : mockSoldNFTs;

      setSoldNFTs(filtered);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [chainId]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
    }

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    }

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Recently Sold</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="bg-[#1a1a2e] rounded-lg overflow-hidden animate-pulse flex"
              >
                <div className="h-[80px] w-[80px] bg-[#2a2a3e]"></div>
                <div className="p-4 flex-1 space-y-2">
                  <div className="h-4 bg-[#2a2a3e] rounded w-3/4"></div>
                  <div className="h-4 bg-[#2a2a3e] rounded w-1/2"></div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  if (soldNFTs.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Recently Sold</h2>
        </div>

        <div className="bg-[#1a1a2e] rounded-lg p-8 text-center">
          <p className="text-gray-400">
            No recently sold NFTs for the selected chain.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recently Sold</h2>
        <Link href="/activity">
          <Button
            variant="ghost"
            className="text-[#ff007a] hover:text-[#ff007a]/80 hover:bg-[#2a2a3e] gap-2"
          >
            View All Activity
            <ArrowRight size={16} />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {soldNFTs.slice(0, 6).map((nft, index) => (
          <motion.div
            key={nft.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link
              href={`/nfts/${nft.id}`}
              className="flex bg-[#1a1a2e] rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group"
            >
              <div className="relative h-[80px] w-[80px]">
                <Image
                  src={
                    nft.image ||
                    `https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?80x80`
                  }
                  alt={nft.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-white group-hover:text-[#ff007a] transition-colors">
                      {nft.name}
                    </h3>

                    <p className="text-sm text-gray-400">
                      Sold by{" "}
                      <span className="text-[#ff007a]">{nft.seller}</span> to{" "}
                      <span className="text-[#ff007a]">{nft.buyer}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={12} />
                    <span>{formatTimeAgo(nft.soldAt)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: nft.chain.color }}
                    >
                      <Image
                        src={
                          nft.chain.icon ||
                          "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
                        }
                        alt={nft.chain.name}
                        width={10}
                        height={10}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {nft.price} {nft.chain.symbol}
                    </span>
                  </div>

                  <div className="text-xs px-2 py-1 rounded-full bg-[#2a2a3e]">
                    Sale
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
