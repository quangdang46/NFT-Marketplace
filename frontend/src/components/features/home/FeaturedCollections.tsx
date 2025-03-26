"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import { mockCollections, mockChains } from "../../../data/mockData";

interface FeaturedCollectionsProps {
  chainId: string | null;
  viewMode: "grid" | "list" | "compact";
}

export function FeaturedCollections({
  chainId,
  viewMode,
}: FeaturedCollectionsProps) {
  const [loading, setLoading] = useState(true);
  const [filteredCollections, setFilteredCollections] =
    useState(mockCollections);
  const [likedCollections, setLikedCollections] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    // Filter collections by chain if chainId is provided
    if (chainId) {
      setFilteredCollections(
        mockCollections.filter((collection) => collection.chain.id === chainId)
      );
    } else {
      // Show all collections if chainId is null (All Chains selected)
      setFilteredCollections(mockCollections);
    }

    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [chainId]);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedCollections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {viewMode === "compact" ? (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {Array(12)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-[#1a1a2e] rounded-lg overflow-hidden animate-pulse"
                >
                  <div className="h-[120px] bg-[#2a2a3e]"></div>
                  <div className="p-2 space-y-1">
                    <div className="h-3 bg-[#2a2a3e] rounded w-3/4"></div>
                    <div className="h-3 bg-[#2a2a3e] rounded w-1/2"></div>
                  </div>
                </div>
              ))}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(8)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-[#1a1a2e] rounded-lg overflow-hidden animate-pulse"
                >
                  <div className="h-[200px] bg-[#2a2a3e]"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-[#2a2a3e] rounded w-3/4"></div>
                    <div className="h-4 bg-[#2a2a3e] rounded w-1/2"></div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="space-y-4">
            {Array(4)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-[#1a1a2e] rounded-lg overflow-hidden animate-pulse flex"
                >
                  <div className="h-[120px] w-[120px] bg-[#2a2a3e]"></div>
                  <div className="p-4 flex-1 space-y-2">
                    <div className="h-4 bg-[#2a2a3e] rounded w-3/4"></div>
                    <div className="h-4 bg-[#2a2a3e] rounded w-1/2"></div>
                    <div className="h-4 bg-[#2a2a3e] rounded w-1/4"></div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {viewMode === "compact" ? (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {filteredCollections.slice(0, 12).map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link
                href={`/collections/${collection.id}`}
                className="block bg-gradient-to-b from-[#1a1a2e] to-[#2a2a3e] rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.05] group relative"
              >
                <div className="relative h-[120px]">
                  <Image
                    src={`https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20?height=120&width=120&text=Collection%20${
                      index + 1
                    }`}
                    alt={collection.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1e] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Chain badge */}
                  <div
                    className="absolute top-2 left-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor:
                        mockChains.find((c) => c.id === collection.chain.id)
                          ?.color || "#ff007a",
                    }}
                  >
                    <Image
                      src={
                        mockChains.find((c) => c.id === collection.chain.id)
                          ?.icon ||
                        "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
                      }
                      alt={collection.chain.id}
                      width={12}
                      height={12}
                    />
                  </div>
                </div>
                <div className="p-2">
                  <h3 className="text-sm font-medium truncate text-white group-hover:text-[#ff007a] transition-colors">
                    {collection.name}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Floor: {collection.floorPrice.toFixed(2)}{" "}
                    {
                      mockChains.find((c) => c.id === collection.chain.id)
                        ?.symbol
                    }
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredCollections.slice(0, 8).map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                href={`/collections/${collection.id}`}
                className="block bg-gradient-to-b from-[#1a1a2e] to-[#2a2a3e] rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group relative"
              >
                <div className="relative h-[200px]">
                  <Image
                    src={`https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20?height=200&width=200&text=Collection%20${
                      index + 1
                    }`}
                    alt={collection.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1e] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Like button */}
                  <button
                    className="absolute top-2 right-2 p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-colors z-10"
                    onClick={(e) => toggleLike(collection.id, e)}
                  >
                    <Heart
                      size={16}
                      className={`${
                        likedCollections[collection.id]
                          ? "fill-red-500 text-red-500"
                          : "text-white"
                      }`}
                    />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold truncate text-white group-hover:text-[#ff007a] transition-colors">
                      {collection.name}
                    </h3>
                    <div className="flex items-center">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor:
                            mockChains.find((c) => c.id === collection.chain.id)
                              ?.color || "#ff007a",
                        }}
                      >
                        <Image
                          src={
                            mockChains.find((c) => c.id === collection.chain.id)
                              ?.icon ||
                            "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
                          }
                          alt={collection.chain.id}
                          width={12}
                          height={12}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-300">
                    <div>
                      <p>Floor</p>
                      <p className="font-medium">
                        {collection.floorPrice.toFixed(2)}{" "}
                        {
                          mockChains.find((c) => c.id === collection.chain.id)
                            ?.symbol
                        }
                      </p>
                    </div>
                    <div>
                      <p>Volume</p>
                      <p className="font-medium">
                        {collection.volume.toFixed(2)}{" "}
                        {
                          mockChains.find((c) => c.id === collection.chain.id)
                            ?.symbol
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCollections.slice(0, 6).map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                href={`/collections/${collection.id}`}
                className="flex bg-gradient-to-r from-[#1a1a2e] to-[#2a2a3e] rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.01] group relative"
              >
                <div className="relative h-[120px] w-[120px] md:h-[150px] md:w-[150px]">
                  <Image
                    src={`https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20?height=150&width=150&text=Collection%20${
                      index + 1
                    }`}
                    alt={collection.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Chain badge */}
                  <div
                    className="absolute bottom-2 left-2 px-2 py-1 bg-black/30 backdrop-blur-sm rounded-full flex items-center gap-1 z-10"
                    style={{
                      backgroundColor: `${
                        mockChains.find((c) => c.id === collection.chain.id)
                          ?.color
                      }40`,
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: mockChains.find(
                          (c) => c.id === collection.chain.id
                        )?.color,
                      }}
                    >
                      <Image
                        src={
                          mockChains.find((c) => c.id === collection.chain.id)
                            ?.icon ||
                          "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
                        }
                        alt={collection.chain.id}
                        width={10}
                        height={10}
                      />
                    </div>
                    <span className="text-xs font-medium">
                      {
                        mockChains.find((c) => c.id === collection.chain.id)
                          ?.name
                      }
                    </span>
                  </div>
                </div>

                <div className="flex-1 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white group-hover:text-[#ff007a] transition-colors text-lg">
                      {collection.name}
                    </h3>
                    <button
                      className="p-2 bg-[#2a2a3e] rounded-full hover:bg-[#3a3a4e] transition-colors"
                      onClick={(e) => toggleLike(collection.id, e)}
                    >
                      <Heart
                        size={16}
                        className={`${
                          likedCollections[collection.id]
                            ? "fill-red-500 text-red-500"
                            : "text-white"
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                    A unique collection of digital art featuring stunning
                    visuals and rare attributes.
                  </p>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-[#0f0f1e] p-2 rounded-lg">
                      <p className="text-xs text-gray-400">Floor</p>
                      <p className="font-medium text-sm">
                        {collection.floorPrice.toFixed(2)}{" "}
                        {
                          mockChains.find((c) => c.id === collection.chain.id)
                            ?.symbol
                        }
                      </p>
                    </div>
                    <div className="bg-[#0f0f1e] p-2 rounded-lg">
                      <p className="text-xs text-gray-400">Volume</p>
                      <p className="font-medium text-sm">
                        {collection.volume.toFixed(2)}{" "}
                        {
                          mockChains.find((c) => c.id === collection.chain.id)
                            ?.symbol
                        }
                      </p>
                    </div>
                    <div className="bg-[#0f0f1e] p-2 rounded-lg">
                      <p className="text-xs text-gray-400">Items</p>
                      <p className="font-medium text-sm">
                        {Math.floor(Math.random() * 1000) + 100}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <Link href="/collections">
          <Button className="bg-[#2a2a3e] hover:bg-[#3a3a4e] gap-2">
            View All Collections
            <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
