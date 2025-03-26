"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowRight } from "lucide-react";
import { mockNFTs } from "../../../data/mockData";
import { Button } from "@/components/ui/button";

interface UserFavoritesProps {
  userId: string;
  showAll?: boolean;
}

export function UserFavorites({ userId, showAll = false }: UserFavoritesProps) {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch user's favorites
    const fetchFavorites = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        // Use a random subset of mock NFTs as favorites
        const userFavorites = mockNFTs
          .sort(() => 0.5 - Math.random())
          .slice(0, showAll ? 18 : 6)
          .map((nft) => ({
            ...nft,
            likedDate: new Date(
              Date.now() - Math.floor(Math.random() * 10000000000)
            ),
          }));

        setFavorites(userFavorites);
        setLoading(false);
        setHasMore(showAll && userFavorites.length >= 18);
      }, 1500);
    };

    fetchFavorites();
  }, [userId, showAll, page]);

  const loadMore = () => {
    if (!hasMore || loading) return;

    setPage((prevPage) => prevPage + 1);
    setLoading(true);
  };

  if (loading && favorites.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Favorites</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array(showAll ? 12 : 6)
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
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Favorites</h2>

        <div className="bg-card p-8 rounded-lg text-center">
          <p className="text-muted-foreground mb-4">No favorites found.</p>
          <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {userId === "me"
              ? "Like some NFTs to add them to your favorites."
              : "This user hasn't liked any NFTs yet."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!showAll && <h2 className="text-xl font-bold">Favorites</h2>}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {favorites.map((nft) => (
          <Link
            key={nft.id}
            href={`/nfts/${nft.id}`}
            className="bg-card rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group relative"
          >
            <div className="relative h-[200px]">
              <Image
                src={
                  nft.image ||
                  "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
                }
                alt={nft.name}
                fill
                className="object-cover"
              />

              <div className="absolute top-2 right-2">
                <Heart className="h-5 w-5 fill-primary text-primary" />
              </div>

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

            <div className="p-4">
              <h3 className="font-semibold truncate">{nft.name}</h3>
              <p className="text-sm font-medium">
                {nft.price} {nft.chain.symbol}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Liked: {new Date(nft.likedDate).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {loading && favorites.length > 0 && (
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
              href={`/profile/${userId}/favorites`}
              className="flex items-center gap-2"
            >
              View All Favorites
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
