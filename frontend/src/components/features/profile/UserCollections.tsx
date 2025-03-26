/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { mockCollections } from "../../../data/mockData";
import { ArrowRight } from "lucide-react";
import { FilterSidebar } from "../shared/FilterSidebar";
import { FilterToggle } from "../shared/FilterToggle";
import { ItemSelector } from "../shared/ItemSelector";

interface UserCollectionsProps {
  userId: string;
  showAll?: boolean;
}

export function UserCollections({
  userId,
  showAll = false,
}: UserCollectionsProps) {
  const [collections, setCollections] = useState<any[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<any[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
    // Simulate API call to fetch user's collections
    const fetchCollections = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        // Use a subset of mock collections
        const userCollections = mockCollections
          .slice(0, showAll ? 12 : 4)
          .map((collection) => ({
            ...collection,
            itemCount: Math.floor(Math.random() * 50) + 5,
            createdDate: new Date(
              Date.now() - Math.floor(Math.random() * 10000000000)
            ),
          }));

        setCollections(userCollections);
        setFilteredCollections(userCollections);
        setLoading(false);
        setHasMore(showAll && userCollections.length >= 12);
      }, 1500);
    };

    fetchCollections();
  }, [userId, showAll, page]);

  // Apply filters when they change
  const applyFilters = useCallback(() => {
    if (collections.length === 0) return;

    setFilteredCollections(() => {
      let result = [...collections];

      // Filter by tab
      if (filters.tab === "nfts") {
        // Apply NFT specific filters
      } else if (filters.tab === "collections") {
        // Apply collection specific filters
      }

      // Filter by chain
      if (filters.chains.length > 0) {
        result = result.filter((collection) =>
          filters.chains.includes(collection.chain.id)
        );
      }

      // Filter by search query
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter((collection) =>
          collection.name.toLowerCase().includes(searchLower)
        );
      }

      // Sort results
      result.sort((a, b) => {
        switch (filters.sort) {
          case "recent":
            return (
              new Date(b.createdDate).getTime() -
              new Date(a.createdDate).getTime()
            );
          case "oldest":
            return (
              new Date(a.createdDate).getTime() -
              new Date(b.createdDate).getTime()
            );
          case "price-high":
            return b.floorPrice - a.floorPrice;
          case "price-low":
            return a.floorPrice - b.floorPrice;
          case "popular":
            return b.volume - a.volume;
          default:
            return 0;
        }
      });

      return result;
    });
  }, [collections, filters]);

  useEffect(() => {
    applyFilters();
  }, [filters, collections, applyFilters]);

  const loadMore = () => {
    if (!hasMore || loading) return;

    setPage((prevPage) => prevPage + 1);
    setLoading(true);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleSelectionChange = (items: any[]) => {
    setSelectedCollections(items);
  };

  // Fix the toggle functionality in UserCollections component

  // Update the toggleSidebar function to ensure it works properly
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading && collections.length === 0) {
    return (
      <div className="flex">
        <div className="hidden md:block w-[280px]"></div>
        <div className="flex-1 space-y-6 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">My Collections</h2>
            <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array(showAll ? 8 : 4)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-card rounded-lg overflow-hidden animate-pulse"
                >
                  <div className="h-[150px] bg-muted"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  if (filteredCollections.length === 0 && !loading) {
    return (
      <div className="flex">
        <FilterSidebar
          isOpen={isSidebarOpen}
          onClose={toggleSidebar}
          onFilterChange={handleFilterChange}
        />

        <div className="flex-1 p-4 space-y-6">
          {/* Update the filter toggle section to be more visible */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              {userId === "me" ? "My Collections" : "Collections"}
            </h2>
            <div className="flex items-center gap-2">
              <FilterToggle onClick={toggleSidebar} isOpen={isSidebarOpen} />
              {userId === "me" && (
                <Button asChild>
                  <Link href="/create/collection">Create Collection</Link>
                </Button>
              )}
            </div>
          </div>

          <div className="bg-card p-8 rounded-lg text-center">
            <p className="text-muted-foreground mb-4">
              No collections found matching your criteria.
            </p>
            <Button asChild>
              <Link href="/collections">Browse Collections</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Update the layout for better responsiveness
  return (
    <div className="flex flex-col md:flex-row">
      <FilterSidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        onFilterChange={handleFilterChange}
      />

      <div className="flex-1 p-2 md:p-4 space-y-4 md:space-y-6">
        {/* Update the filter toggle section to be more visible */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
          <h2 className="text-xl font-bold">
            {userId === "me" ? "My Collections" : "Collections"}
          </h2>
          <div className="flex items-center gap-2">
            <FilterToggle onClick={toggleSidebar} isOpen={isSidebarOpen} />
            {userId === "me" && (
              <Button asChild>
                <Link href="/create/collection">Create Collection</Link>
              </Button>
            )}
          </div>
        </div>

        <ItemSelector
          items={filteredCollections}
          onSelectionChange={handleSelectionChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {filteredCollections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.id}`}
              className={`bg-card rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02] flex flex-col md:flex-row ${
                selectedCollections.includes(collection)
                  ? "ring-2 ring-primary"
                  : ""
              }`}
            >
              <div className="relative h-[120px] sm:h-[150px] md:w-[150px] md:h-full">
                <Image
                  src={`https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?150x150`}
                  alt={collection.name || "Collection"}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-3 md:p-4 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-sm sm:text-base truncate">
                    {collection.name}
                  </h3>
                  <div
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: collection.chain.color }}
                  >
                    <Image
                      src={
                        collection.chain.icon ||
                        "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
                      }
                      alt={collection.chain.name || "Chain Icon"}
                      width={10}
                      height={10}
                    />
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground mb-2 md:mb-4">
                  Created:{" "}
                  {new Date(collection.createdDate).toLocaleDateString()}
                </p>

                <div className="grid grid-cols-3 gap-1 sm:gap-2">
                  <div className="bg-background p-1 sm:p-2 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Items</p>
                    <p className="font-medium text-xs sm:text-sm">
                      {collection.itemCount}
                    </p>
                  </div>
                  <div className="bg-background p-1 sm:p-2 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Floor</p>
                    <p className="font-medium text-xs sm:text-sm">
                      {collection.floorPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-background p-1 sm:p-2 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Volume</p>
                    <p className="font-medium text-xs sm:text-sm">
                      {collection.volume.toFixed(2)}
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

        {!showAll && (
          <div className="flex justify-center">
            <Button variant="outline" asChild>
              <Link
                href={`/profile/${userId}/collections`}
                className="flex items-center gap-2"
              >
                View All Collections
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
