"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Grid, List, ArrowRight } from "lucide-react";
import { mockNFTs } from "../../../data/mockData";
import { FilterSidebar } from "../shared/FilterSidebar";
import { FilterToggle } from "../shared/FilterToggle";
import { ItemSelector } from "../shared/ItemSelector";

interface UserNFTsProps {
  userId: string;
  showAll?: boolean;
}

export function UserNFTs({ userId, showAll = false }: UserNFTsProps) {
  const [nfts, setNfts] = useState<any[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<any[]>([]);
  const [selectedNfts, setSelectedNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    tab: "all",
    priceRange: [0, 100],
    chains: [] as string[],
    verified: false,
    sort: "recent",
    search: "",
  });

  useEffect(() => {
    // Simulate API call to fetch user's NFTs
    const fetchNFTs = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        // Use a subset of mock NFTs
        const userNFTs = mockNFTs.slice(0, showAll ? 24 : 12).map((nft) => ({
          ...nft,
          acquiredDate: new Date(
            Date.now() - Math.floor(Math.random() * 10000000000)
          ),
        }));

        setNfts(userNFTs);
        setFilteredNfts(userNFTs);
        setLoading(false);
        setHasMore(showAll && userNFTs.length >= 24);
      }, 1500);
    };

    fetchNFTs();
  }, [userId, showAll, page]);

  // Apply filters when they change
  const applyFilters = useCallback(() => {
    if (nfts.length === 0) return;

    setFilteredNfts(() => {
      let result = [...nfts];

      // Filter by tab
      if (filters.tab === "nfts") {
        // Apply NFT specific filters
      } else if (filters.tab === "collections") {
        // Apply collection specific filters
      }

      // Filter by chain
      if (filters.chains.length > 0) {
        result = result.filter((nft) => filters.chains.includes(nft.chain.id));
      }

      // Filter by price range
      result = result.filter(
        (nft) =>
          Number(nft.price) >= filters.priceRange[0] &&
          Number(nft.price) <= filters.priceRange[1]
      );

      // Filter by search query
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter((nft) =>
          nft.name.toLowerCase().includes(searchLower)
        );
      }

      // Sort results
      result.sort((a, b) => {
        switch (filters.sort) {
          case "recent":
            return (
              new Date(b.acquiredDate).getTime() -
              new Date(a.acquiredDate).getTime()
            );
          case "oldest":
            return (
              new Date(a.acquiredDate).getTime() -
              new Date(b.acquiredDate).getTime()
            );
          case "price-high":
            return Number(b.price) - Number(a.price);
          case "price-low":
            return Number(a.price) - Number(b.price);
          case "popular":
            return 0; // Would need popularity data
          default:
            return 0;
        }
      });

      return result;
    });
  }, [nfts, filters]);

  useEffect(() => {
    applyFilters();
  }, [filters, nfts, applyFilters]);

  const loadMore = () => {
    if (!hasMore || loading) return;

    setPage((prevPage) => prevPage + 1);
    setLoading(true);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleSelectionChange = (items: any[]) => {
    setSelectedNfts(items);
  };

  // Update the toggleSidebar function to ensure it works properly
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading && nfts.length === 0) {
    return (
      <div className="flex">
        <div className="hidden md:block w-[280px]"></div>
        <div className="flex-1 space-y-6 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">My NFTs</h2>
            <div className="flex gap-2">
              <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
              <div className="h-10 w-10 bg-muted rounded animate-pulse"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(showAll ? 16 : 8)
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
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  if (filteredNfts.length === 0 && !loading) {
    return (
      <div className="flex">
        <FilterSidebar
          isOpen={isSidebarOpen}
          onClose={toggleSidebar}
          onFilterChange={handleFilterChange}
        />

        <div className="flex-1 p-4 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              {userId === "me" ? "My NFTs" : "NFTs"}
            </h2>
            <FilterToggle onClick={toggleSidebar} isOpen={isSidebarOpen} />
          </div>

          <div className="bg-card p-8 rounded-lg text-center">
            <p className="text-muted-foreground mb-4">
              No NFTs found matching your criteria.
            </p>
            <Button asChild>
              <Link href="/collections">Browse Collections</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row">
      <FilterSidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        onFilterChange={handleFilterChange}
      />

      <div className="flex-1 p-2 md:p-4 space-y-4 md:space-y-6">
        {/* Make sure the FilterToggle is properly visible and working */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
          <h2 className="text-xl font-bold">
            {userId === "me" ? "My NFTs" : "NFTs"}
          </h2>
          <div className="flex items-center gap-2">
            <FilterToggle onClick={toggleSidebar} isOpen={isSidebarOpen} />

            <div className="hidden md:flex border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className={viewMode === "grid" ? "bg-muted" : ""}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={viewMode === "list" ? "bg-muted" : ""}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <ItemSelector
          items={filteredNfts}
          onSelectionChange={handleSelectionChange}
        />

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filteredNfts.map((nft) => (
              <Link
                key={nft.id}
                href={`/nfts/${nft.id}`}
                className={`bg-card rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02] ${
                  selectedNfts.includes(nft) ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className="relative h-[160px] sm:h-[180px] md:h-[200px]">
                  <Image
                    src={
                      nft.image ||
                      "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
                    }
                    alt={nft.name}
                    fill
                    className="object-cover"
                  />

                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full flex items-center gap-1">
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
                    <span className="text-xs font-medium text-white">
                      {nft.chain.name}
                    </span>
                  </div>
                </div>

                <div className="p-3 md:p-4">
                  <h3 className="font-semibold truncate">{nft.name}</h3>
                  <p className="text-sm font-medium">
                    {nft.price} {nft.chain.symbol}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Acquired: {new Date(nft.acquiredDate).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {filteredNfts.map((nft) => (
              <Link
                key={nft.id}
                href={`/nfts/${nft.id}`}
                className={`flex bg-card rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 ${
                  selectedNfts.includes(nft) ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className="relative h-[80px] w-[80px] sm:h-[100px] sm:w-[100px]">
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

                <div className="p-2 sm:p-4 flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base">
                        {nft.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        <div
                          className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: nft.chain.color }}
                        >
                          <Image
                            src={
                              nft.chain.icon ||
                              "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
                            }
                            alt={nft.chain.name}
                            width={8}
                            height={8}
                          />
                        </div>
                        <span className="text-xs">{nft.chain.name}</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right mt-1 sm:mt-0">
                      <p className="font-medium text-sm sm:text-base">
                        {nft.price} {nft.chain.symbol}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Acquired:{" "}
                        {new Date(nft.acquiredDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

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

        {!showAll && (
          <div className="flex justify-center">
            <Button variant="outline" asChild>
              <Link
                href={`/profile/${userId}/nfts`}
                className="flex items-center gap-2"
              >
                View All NFTs
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
