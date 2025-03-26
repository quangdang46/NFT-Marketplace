"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { mockNFTs } from "../../../data/mockData";

interface NFTCarouselProps {
  chainId: string | null;
}

export function NFTCarousel({ chainId }: NFTCarouselProps) {
  const [filteredNFTs, setFilteredNFTs] = useState(mockNFTs);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedNFTs, setLikedNFTs] = useState<Record<string, boolean>>({});
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Filter NFTs by chain if chainId is provided
    if (chainId) {
      setFilteredNFTs(mockNFTs.filter((nft) => nft.chain.id === chainId));
    } else {
      // Show all NFTs if chainId is null (All Chains selected)
      setFilteredNFTs(mockNFTs);
    }

    // Reset index when NFTs change
    setCurrentIndex(0);
  }, [chainId]);

  useEffect(() => {
    if (autoplay) {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % filteredNFTs.length);
      }, 5000);
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, filteredNFTs.length]);

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + filteredNFTs.length) % filteredNFTs.length
    );
    // Pause autoplay when user interacts
    setAutoplay(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredNFTs.length);
    // Pause autoplay when user interacts
    setAutoplay(false);
  };

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedNFTs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (filteredNFTs.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold mb-6">Featured NFTs</h2>

      <div className="relative overflow-hidden rounded-xl">
        <div className="absolute top-1/2 left-4 z-10 transform -translate-y-1/2">
          <button
            onClick={handlePrev}
            className="bg-black/30 backdrop-blur-sm p-2 rounded-full hover:bg-black/50 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        <div className="absolute top-1/2 right-4 z-10 transform -translate-y-1/2">
          <button
            onClick={handleNext}
            className="bg-black/30 backdrop-blur-sm p-2 rounded-full hover:bg-black/50 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="relative h-[400px] md:h-[500px]">
          {filteredNFTs.map((nft, index) => (
            <motion.div
              key={nft.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{
                opacity: currentIndex === index ? 1 : 0,
                zIndex: currentIndex === index ? 1 : 0,
              }}
              transition={{ duration: 0.5 }}
            >
              <Link href={`/nfts/${nft.id}`} className="block h-full">
                <div className="relative h-full">
                  <Image
                    src={
                      nft.image ||
                      `https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?500x1200`
                    }
                    alt={nft.name}
                    fill
                    className="object-cover rounded-xl"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1e] to-transparent"></div>

                  <div className="absolute top-4 right-4">
                    <button
                      className="p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-colors"
                      onClick={(e) => toggleLike(nft.id, e)}
                    >
                      <Heart
                        size={20}
                        className={`${
                          likedNFTs[nft.id]
                            ? "fill-red-500 text-red-500"
                            : "text-white"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: nft.chain.color }}
                      >
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
                      <span className="text-sm">{nft.chain.name}</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold mb-2">
                      {nft.name}
                    </h3>

                    <p className="text-gray-300 mb-4 line-clamp-2 md:w-2/3">
                      {nft.description ||
                        "A unique digital collectible with special attributes and rare features."}
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Price</p>
                        <p className="text-xl font-bold">
                          {nft.price} {nft.chain.symbol}
                        </p>
                      </div>

                      <div className="bg-[#ff007a] hover:bg-[#ff007a]/80 text-white px-4 py-2 rounded-lg">
                        View Details
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-4 gap-2">
        {filteredNFTs.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? "w-6 bg-[#ff007a]"
                : "bg-white/30 hover:bg-white/50"
            }`}
            onClick={() => {
              setCurrentIndex(index);
              setAutoplay(false);
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
