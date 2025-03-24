"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, ArrowUpRight, Heart, Share2, Flag } from "lucide-react";
import { motion } from "framer-motion";
import { mockNFTs } from "@/data/mockData";

interface AuctionDetailProps {
  auctionId: string;
}

export function AuctionDetail({ auctionId }: AuctionDetailProps) {
  const [auction, setAuction] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Simulate API call to get auction details
    const timer = setTimeout(() => {
      // Get the index from the auctionId
      const index = Number.parseInt(auctionId.split("-")[1] || "0");
      const nft = mockNFTs[index % mockNFTs.length];

      if (nft) {
        // Random end time between 1 hour and 3 days from now
        const hoursToAdd = Math.floor(Math.random() * 72) + 1;
        const endTime = new Date();
        endTime.setHours(endTime.getHours() + hoursToAdd);

        // Random starting bid
        const startingBid =
          Number.parseFloat(nft.price) * (Math.random() * 0.5 + 0.8);

        // Random number of bids
        const bidCount = Math.floor(Math.random() * 20);

        // Generate bid history
        const bidHistory = Array(bidCount)
          .fill(null)
          .map((_, i) => {
            const bidTime = new Date(endTime);
            bidTime.setHours(bidTime.getHours() - (i + 1) * Math.random() * 5);

            return {
              id: `bid-${i}`,
              amount: startingBid + (bidCount - i) * 0.1,
              bidder: `User${Math.floor(Math.random() * 1000)}`,
              time: bidTime,
            };
          })
          .sort((a, b) => b.amount - a.amount);

        const mockAuction = {
          ...nft,
          id: auctionId,
          endTime,
          startingBid,
          currentBid:
            bidHistory.length > 0 ? bidHistory[0].amount : startingBid,
          bidCount,
          highestBidder: bidHistory.length > 0 ? bidHistory[0].bidder : null,
          bidHistory,
        };

        setAuction(mockAuction);
        setBidAmount((mockAuction.currentBid + 0.1).toFixed(2));
        setLoading(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [auctionId]);

  // Update time remaining
  useEffect(() => {
    if (!auction) return;

    const updateTimeRemaining = () => {
      const now = new Date();
      const diff = auction.endTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining("Auction ended");
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours < 24) {
        setTimeRemaining(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      } else {
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        setTimeRemaining(
          `${days}d ${remainingHours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }
    };

    updateTimeRemaining();
    timerRef.current = setInterval(updateTimeRemaining, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [auction]);

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate bid amount
    const bidValue = Number.parseFloat(bidAmount);
    if (isNaN(bidValue) || bidValue <= auction.currentBid) {
      alert("Please enter a bid higher than the current bid");
      return;
    }

    // In a real app, this would submit the bid to the backend
    alert(`Bid of ${bidAmount} ${auction.chain.symbol} placed successfully!`);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row gap-8 animate-pulse">
        <div className="w-full md:w-1/2 h-[400px] bg-card rounded-lg"></div>
        <div className="w-full md:w-1/2 space-y-4">
          <div className="h-8 bg-muted rounded w-3/4"></div>
          <div className="h-6 bg-muted rounded w-1/2"></div>
          <div className="h-24 bg-muted rounded w-full"></div>
          <div className="h-12 bg-muted rounded w-full"></div>
          <div className="h-40 bg-muted rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!auction) {
    return <div>Auction not found</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/2">
        <div className="relative rounded-lg overflow-hidden">
          <Image
            src={
              auction.image ||
              "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?500x500"
            }
            alt={auction.name}
            width={500}
            height={500}
            className="w-full object-cover rounded-lg"
          />

          <div className="absolute top-4 right-4 flex gap-2">
            <button
              className="p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-colors"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart
                size={20}
                className={`${
                  isLiked ? "fill-red-500 text-red-500" : "text-white"
                }`}
              />
            </button>
            <button className="p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-colors">
              <Share2 size={20} />
            </button>
            <button className="p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-colors">
              <Flag size={20} />
            </button>
          </div>
        </div>

        <div className="mt-6 bg-card rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Properties</h3>
          <div className="grid grid-cols-3 gap-3">
            {auction.attributes?.map((attr: any, index: number) => (
              <div key={index} className="bg-muted p-3 rounded-lg text-center">
                <p className="text-xs text-primary uppercase">
                  {attr.trait_type}
                </p>
                <p className="font-medium truncate">{attr.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center"
            style={{ backgroundColor: auction.chain.color }}
          >
            <Image
              src={
                auction.chain.icon ||
                "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
              }
              alt={auction.chain.name}
              width={12}
              height={12}
            />
          </div>
          <span className="text-sm">{auction.chain.name}</span>
        </div>

        <h1 className="text-3xl font-bold mb-2">{auction.name}</h1>

        <Link
          href={`/collections/${auction.collection.id}`}
          className="text-primary hover:underline mb-4 inline-block"
        >
          {auction.collection.name}
        </Link>

        <p className="text-muted-foreground mb-6">{auction.description}</p>

        <div className="bg-card rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Current bid</p>
              <p className="text-2xl font-bold">
                {auction.currentBid.toFixed(2)} {auction.chain.symbol}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-muted-foreground">Auction ends in</p>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                <p className="font-mono font-bold">{timeRemaining}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleBidSubmit} className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="number"
                  step="0.01"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="pr-16"
                  placeholder="Enter bid amount"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  {auction.chain.symbol}
                </div>
              </div>

              <Button
                type="submit"
                className="bg-primary hover:bg-primary/80 text-white"
              >
                Place Bid
                <ArrowUpRight size={16} className="ml-2" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              You must bid at least {(auction.currentBid + 0.1).toFixed(2)}{" "}
              {auction.chain.symbol}
            </p>
          </form>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Bid History</h3>

          {auction.bidHistory.length > 0 ? (
            <div className="bg-card rounded-lg overflow-hidden">
              <div className="max-h-[300px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      <th className="p-3 text-left">Bidder</th>
                      <th className="p-3 text-left">Amount</th>
                      <th className="p-3 text-left">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auction.bidHistory.map((bid: any, index: number) => (
                      <motion.tr
                        key={bid.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-t border-border"
                      >
                        <td className="p-3 font-medium">{bid.bidder}</td>
                        <td className="p-3">
                          {bid.amount.toFixed(2)} {auction.chain.symbol}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {formatDate(bid.time)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              No bids yet. Be the first to place a bid!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
