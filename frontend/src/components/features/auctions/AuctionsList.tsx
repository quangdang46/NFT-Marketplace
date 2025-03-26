"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Clock, Heart, ArrowUpRight } from "lucide-react";
import { mockNFTs } from "@/data/mockData";

export function AuctionsList() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedAuctions, setLikedAuctions] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    // Simulate API call to get auctions
    const timer = setTimeout(() => {
      // Create mock auctions from NFTs
      const mockAuctions = mockNFTs.slice(0, 8).map((nft, index) => {
        // Random end time between 1 hour and 3 days from now
        const hoursToAdd = Math.floor(Math.random() * 72) + 1;
        const endTime = new Date();
        endTime.setHours(endTime.getHours() + hoursToAdd);

        // Random starting bid
        const startingBid =
          Number.parseFloat(nft.price) * (Math.random() * 0.5 + 0.8);

        // Random number of bids
        const bidCount = Math.floor(Math.random() * 20);

        return {
          ...nft,
          id: `auction-${index}`,
          endTime,
          startingBid,
          currentBid: startingBid + bidCount * 0.1,
          bidCount,
          highestBidder: `User${Math.floor(Math.random() * 1000)}`,
        };
      });

      setAuctions(mockAuctions);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedAuctions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Function to format time remaining
  const formatTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();

    if (diff <= 0) return "Ended";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours < 24) {
      return `${hours}h ${minutes}m`;
    } else {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}d ${remainingHours}h`;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="bg-card rounded-lg overflow-hidden animate-pulse"
            >
              <div className="h-[250px] bg-muted"></div>
              <div className="p-4 space-y-2">
                <div className="h-5 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-10 bg-muted rounded w-full mt-4"></div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {auctions.map((auction, index) => (
        <motion.div
          key={auction.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Link
            href={`/auctions/${auction.id}`}
            className="block bg-gradient-to-b from-card to-card/80 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group relative"
          >
            <div className="relative h-[250px]">
              <Image
                src={
                  auction.image ||
                  `https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?250x250`
                }
                alt={auction.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Like button */}
              <button
                className="absolute top-2 right-2 p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-colors z-10"
                onClick={(e) => toggleLike(auction.id, e)}
              >
                <Heart
                  size={16}
                  className={`${
                    likedAuctions[auction.id]
                      ? "fill-red-500 text-red-500"
                      : "text-white"
                  }`}
                />
              </button>

              {/* Chain badge */}
              <div
                className="absolute top-2 left-2 px-2 py-1 bg-black/30 backdrop-blur-sm rounded-full flex items-center gap-1 z-10"
                style={{ backgroundColor: `${auction.chain.color}40` }}
              >
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: auction.chain.color }}
                >
                  <Image
                    src={
                      auction.chain.icon ||
                      "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
                    }
                    alt={auction.chain.name}
                    width={10}
                    height={10}
                  />
                </div>
                <span className="text-xs font-medium">
                  {auction.chain.name}
                </span>
              </div>

              {/* Time remaining */}
              <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full flex items-center gap-1 z-10">
                <Clock size={14} className="text-primary" />
                <span className="text-xs font-medium">
                  {formatTimeRemaining(auction.endTime)}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {auction.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {auction.collection.name} • {auction.bidCount} bids
              </p>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-muted-foreground">Current bid</p>
                  <p className="font-bold text-foreground">
                    {auction.currentBid.toFixed(2)} {auction.chain.symbol}
                  </p>
                </div>

                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/80 text-white"
                >
                  Place Bid
                  <ArrowUpRight size={14} className="ml-1" />
                </Button>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
