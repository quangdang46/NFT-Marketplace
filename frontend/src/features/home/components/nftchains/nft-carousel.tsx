"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { NFTCard } from "@/features/home/components/nftchains/nft-card";

const nftData = [
  {
    title: "IDIOTS",
    image:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=500",
    collection: "LAUNCHPAD",
    currency: "BTC",
    description:
      "Join the exclusive IDIOTS collection featuring unique digital art pieces.",
  },
  {
    title: "Quantum Cats",
    image:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=500",
    collection: "HOT COLLECTION",
    currency: "BTC",
    description:
      "The Quantum Cats by Taproot Wizards are on a mission to revive Satoshi's beloved pet.",
  },
  {
    title: "NodeMonkes",
    image:
      "https://images.unsplash.com/photo-1563483783356-1f34a7f1b42d?q=80&w=500",
    collection: "HOT COLLECTION",
    currency: "BTC",
    description:
      "Discover the world of NodeMonkes, where digital art meets blockchain technology.",
  },
  {
    title: "Bitcoin Puppets",
    image:
      "https://images.unsplash.com/photo-1569429593410-b498b3fb3387?q=80&w=500",
    collection: "HOT COLLECTION",
    currency: "BTC",
    description: "Unique digital puppets living on the Bitcoin blockchain.",
  },
  {
    title: "OnChainMonkey",
    image:
      "https://images.unsplash.com/photo-1627672360124-4ed09583e14c?q=80&w=500",
    collection: "HOT COLLECTION",
    currency: "BTC",
    description:
      "Genesis collection of the revolutionary OnChainMonkey series.",
  },
];

export function NFTCarousel() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {nftData.map((nft, index) => (
            <CarouselItem
              key={index}
              className="pl-4 basis-full md:basis-[45%] lg:basis-[30%]"
            >
              <NFTCard {...nft} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
}
