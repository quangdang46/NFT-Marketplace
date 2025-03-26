"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface CollectionDetailProps {
  collectionId: string;
}

interface Collection {
  id: string;
  address: string;
  name: string;
  description: string;
  image: string;
  floorPrice: number;
  volume: number;
  itemCount: number;
  ownerAddress: string;
  chain: {
    id: string;
    name: string;
    icon: string;
    symbol: string;
    explorerUrl: string;
  };
}

export function CollectionDetail({ collectionId }: CollectionDetailProps) {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    // Simulating API call
    const fetchCollection = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        const chainIndex = Math.floor(Math.random() * 3);
        const chainIds = ["solana", "ethereum", "polygon"];
        const chainNames = ["Solana", "Ethereum", "Polygon"];
        const chainSymbols = ["SOL", "ETH", "MATIC"];
        const explorerUrls = [
          "https://solscan.io",
          "https://etherscan.io",
          "https://polygonscan.com",
        ];

        const mockCollection = {
          id: collectionId,
          address: `0x${Math.random()
            .toString(16)
            .substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
          name: `Awesome Collection ${collectionId}`,
          description:
            "This is an amazing collection of unique digital art pieces. Each NFT is carefully crafted and has unique properties and rarity.",
          image: `https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?300x300`,
          floorPrice: 0.5 + Math.random() * 2,
          volume: 10 + Math.random() * 100,
          itemCount: 10 + Math.floor(Math.random() * 990),
          ownerAddress: `0x${Math.random()
            .toString(16)
            .substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
          chain: {
            id: chainIds[chainIndex],
            name: chainNames[chainIndex],
            icon: "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20",
            symbol: chainSymbols[chainIndex],
            explorerUrl: explorerUrls[chainIndex],
          },
        };

        setCollection(mockCollection);
        setLoading(false);

        // Simulate 30% chance of being the owner
        setIsOwner(Math.random() > 0.7);
      }, 1000);
    };

    fetchCollection();
  }, [collectionId]);

  const copyAddress = () => {
    if (!collection) return;

    navigator.clipboard.writeText(collection.address);
    toast.success("Address copied", {
      description: "Collection address copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row gap-6 animate-pulse">
        <div className="w-full md:w-[300px] h-[300px] bg-card rounded-lg"></div>
        <div className="flex-1 space-y-4">
          <div className="h-8 bg-muted rounded w-3/4"></div>
          <div className="h-6 bg-muted rounded w-1/2"></div>
          <div className="h-24 bg-muted rounded w-full"></div>
          <div className="flex gap-4">
            <div className="h-10 bg-muted rounded w-32"></div>
            <div className="h-10 bg-muted rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return <div>Collection not found</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-[300px] h-[300px] relative rounded-lg overflow-hidden">
        <Image
          src={
            collection.image ||
            "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
          }
          alt={collection.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold">{collection.name}</h1>
          <div className="flex items-center justify-center bg-card rounded-full p-1">
            <Image
              src={
                collection.chain.icon ||
                "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
              }
              alt={collection.chain.name}
              width={24}
              height={24}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <span>{collection.address}</span>
          <button
            onClick={copyAddress}
            className="text-muted-foreground hover:text-foreground"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>

        <p className="text-muted-foreground mb-6">{collection.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Floor Price</p>
            <p className="font-bold">
              {collection.floorPrice.toFixed(2)} {collection.chain.symbol}
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Volume</p>
            <p className="font-bold">
              {collection.volume.toFixed(2)} {collection.chain.symbol}
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Items</p>
            <p className="font-bold">{collection.itemCount}</p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Chain</p>
            <p className="font-bold">{collection.chain.name}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {isOwner && (
            <Link href={`/create/nft?collection=${collection.id}`}>
              <Button className="bg-primary hover:bg-primary/80">
                Mint NFT
              </Button>
            </Link>
          )}

          <Link
            href={`${collection.chain.explorerUrl}/address/${collection.address}`}
            target="_blank"
          >
            <Button variant="outline">
              View on Explorer <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
