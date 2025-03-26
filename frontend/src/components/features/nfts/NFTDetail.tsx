"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import NFTImageGallery from "@/components/features/nfts/ImageShow/nft-image-gallery";
import NFTCarousel from "@/components/features/nfts/ImageShow/nft-carousel";

interface NFTDetailProps {
  nftId: string;
}

interface NFT {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  owner: {
    id: string;
    name: string;
  };
  collection: {
    id: string;
    name: string;
  };
  chain: {
    id: string;
    name: string;
    icon: string;
    symbol: string;
    explorerUrl: string;
  };
  history: {
    date: string;
    price: number;
    from: string;
    to: string;
    type: "mint" | "sale" | "transfer";
  }[];
}

export function NFTDetail({ nftId }: NFTDetailProps) {
  const [nft, setNft] = useState<NFT | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCarousel, setShowCarousel] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  useEffect(() => {
    // Simulating API call
    const fetchNFT = async () => {
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

        const price = 0.1 + Math.random() * 1;

        const mockNFT = {
          id: nftId,
          name: `Awesome NFT #${nftId}`,
          description:
            "This is an amazing NFT with unique properties. It represents digital art at its finest with vibrant colors and intricate details.",
          images: [
            "https://images.unsplash.com/photo-1741261498263-a5704667520d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1741261498263-a5704667520d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1741261498263-a5704667520d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1741261498263-a5704667520d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          ],
          price,
          owner: {
            id: "user-1",
            name: "CryptoCollector",
          },
          collection: {
            id: "collection-1",
            name: "Awesome Collection",
          },
          chain: {
            id: chainIds[chainIndex],
            name: chainNames[chainIndex],
            icon: "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20?height=24&width=24",
            symbol: chainSymbols[chainIndex],
            explorerUrl: explorerUrls[chainIndex],
          },
          history: [
            {
              date: "2023-06-15",
              price: price * 0.8,
              from: "0x1234...5678",
              to: "CryptoCollector",
              type: "sale",
            },
            {
              date: "2023-05-20",
              price: price * 0.6,
              from: "Creator",
              to: "0x1234...5678",
              type: "sale",
            },
            {
              date: "2023-04-10",
              price: price * 0.5,
              from: "0x0000...0000",
              to: "Creator",
              type: "mint",
            },
          ],
        };

        setNft(mockNFT);
        setLoading(false);
      }, 1000);
    };

    fetchNFT();
  }, [nftId]);
  const handleOpenCarousel = (index: number) => {
    setCarouselIndex(index);
    setShowCarousel(true);
  };
  if (loading) {
    return (
      <div className="flex flex-col md:flex-row gap-6 animate-pulse">
        <div className="w-full md:w-[600px] h-[400px] bg-card rounded-lg">
          <div className="w-full h-full bg-muted rounded-lg"></div>
        </div>
        <div className="flex-1 space-y-4">
          <div className="h-8 bg-muted rounded w-3/4"></div>
          <div className="h-6 bg-muted rounded w-1/2"></div>
          <div className="h-24 bg-muted rounded w-full"></div>
          <div className="flex gap-4">
            <div className="h-10 bg-muted rounded w-32"></div>
            <div className="h-10 bg-muted rounded w-32"></div>
          </div>
          <div className="h-40 bg-muted rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!nft) {
    return <div>NFT not found</div>;
  }

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-[600px] md:h-[800px] relative rounded-lg overflow-hidden">
          {/* <Image
          src={
            nft.image ||
            "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
          }
          alt={nft.name}
          fill
          className="object-cover"
        /> */}

          <NFTImageGallery
            images={nft.images}
            title={nft.name}
            onOpenCarousel={handleOpenCarousel}
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">{nft.name}</h1>
            <div className="flex items-center justify-center bg-card rounded-full p-1">
              <Image
                src={
                  nft.chain.icon ||
                  "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
                }
                alt={nft.chain.name}
                width={24}
                height={24}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <span>Collection: </span>
            <Link
              href={`/collections/${nft.collection.id}`}
              className="text-primary hover:underline"
            >
              {nft.collection.name}
            </Link>
          </div>

          <div className="bg-card p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Current Price</span>
              <span className="text-xl font-bold">
                {nft.price.toFixed(2)} {nft.chain.symbol}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Owner</span>
              <Link
                href={`/profile/${nft.owner.id}`}
                className="text-primary hover:underline"
              >
                {nft.owner.name}
              </Link>
            </div>
          </div>

          <p className="text-muted-foreground mb-6">{nft.description}</p>

          <div className="flex flex-wrap gap-4 mb-8">
            <Button className="bg-primary hover:bg-primary/80">Buy Now</Button>

            <Link
              href={`${nft.chain.explorerUrl}/token/${nft.id}`}
              target="_blank"
            >
              <Button variant="outline">
                View on Explorer <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Transaction History</h2>
            <div className="bg-card rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-4 text-left">Event</th>
                    <th className="p-4 text-left">Price</th>
                    <th className="p-4 text-left">From</th>
                    <th className="p-4 text-left">To</th>
                    <th className="p-4 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {nft.history.map((event, index) => (
                    <tr key={index} className="border-t border-border">
                      <td className="p-4 capitalize">{event.type}</td>
                      <td className="p-4">
                        {event.price.toFixed(2)} {nft.chain.symbol}
                      </td>
                      <td className="p-4">{event.from}</td>
                      <td className="p-4">{event.to}</td>
                      <td className="p-4">{event.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {showCarousel && (
        <NFTCarousel
          images={nft.images}
          initialIndex={carouselIndex}
          onClose={() => setShowCarousel(false)}
        />
      )}
    </>
  );
}
