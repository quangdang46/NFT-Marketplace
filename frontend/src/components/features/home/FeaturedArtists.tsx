"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Artist {
  id: string;
  name: string;
  avatar: string;
  coverImage: string;
  nftCount: number;
  followers: number;
}

export function FeaturedArtists() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const mockArtists = Array(6)
        .fill(null)
        .map((_, index) => ({
          id: `artist-${index + 1}`,
          name: `Artist ${index + 1}`,
          avatar: `https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20?height=100&width=100&text=Artist%20${
            index + 1
          }`,
          coverImage: `https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20?height=200&width=400&text=Artist%20${
            index + 1
          }`,
          nftCount: Math.floor(Math.random() * 100) + 10,
          followers: Math.floor(Math.random() * 10000) + 100,
        }));

      setArtists(mockArtists);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Featured Artists</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="bg-[#1a1a2e] rounded-lg overflow-hidden animate-pulse"
              >
                <div className="h-[100px] bg-[#2a2a3e]"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-[#2a2a3e] rounded w-3/4"></div>
                  <div className="h-4 bg-[#2a2a3e] rounded w-1/2"></div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Featured Artists</h2>
        <Link href="/artists">
          <Button
            variant="ghost"
            className="text-[#ff007a] hover:text-[#ff007a]/80 hover:bg-[#2a2a3e] gap-2"
          >
            View All
            <ArrowRight size={16} />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {artists.map((artist, index) => (
          <motion.div
            key={artist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link
              href={`/artists/${artist.id}`}
              className="block bg-[#1a1a2e] rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.05] group"
            >
              <div className="relative h-[100px]">
                <Image
                  src={
                    artist.coverImage ||
                    "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
                  }
                  alt={artist.name}
                  fill
                  className="object-cover"
                />

                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 border-4 border-[#1a1a2e] rounded-full overflow-hidden">
                  <Image
                    src={
                      artist.avatar ||
                      "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
                    }
                    alt={artist.name}
                    width={60}
                    height={60}
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="pt-12 p-4 text-center">
                <h3 className="font-semibold text-white group-hover:text-[#ff007a] transition-colors">
                  {artist.name}
                </h3>

                <div className="flex justify-center gap-4 mt-2 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <span>{artist.nftCount}</span>
                    <span>NFTs</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{artist.followers.toLocaleString()}</span>
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
