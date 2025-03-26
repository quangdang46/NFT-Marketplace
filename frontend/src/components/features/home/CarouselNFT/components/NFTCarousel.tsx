"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { type CarouselApi } from "@/components/ui/carousel";
import { NFTCard } from "./NFTCard";
import { NFTItem } from "@/types/nft";

interface NFTCarouselProps {
  items: NFTItem[];
}

export function NFTCarousel({ items }: NFTCarouselProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <div className="relative -mx-4 px-4">
      <Carousel
        opts={{ align: "start", loop: true }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="-ml-2">
          {items.map((item) => (
            <CarouselItem
              key={item.id}
              className="pl-2 md:basis-1/3 lg:basis-1/5"
            >
              <NFTCard
                item={item}
                isHovered={hoveredId === item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute -left-4 bg-background/80 backdrop-blur-sm hover:bg-background/90" />
        <CarouselNext className="absolute -right-4 bg-background/80 backdrop-blur-sm hover:bg-background/90" />
      </Carousel>
    </div>
  );
}
