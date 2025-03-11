
/* eslint-disable @next/next/no-img-element */
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { type CarouselApi } from "@/components/ui/carousel";

const items = [
  {
    id: 1,
    title: "SpiKeys Collection",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop",
    price: "0.1 MON",
    items: "225",
    minted: "0%",
    endDate: "Mar 27",
  },
  {
    id: 2,
    title: "SLMND Access Pass",
    image:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2070&auto=format&fit=crop",
    price: "0.1 MON",
    items: "250",
    minted: "0%",
    endDate: "Mar 31",
  },
  {
    id: 3,
    title: "Pepenads Collection",
    image:
      "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?q=80&w=2072&auto=format&fit=crop",
    price: "3 MON",
    items: "60",
    minted: "0%",
    endDate: "Mar 31",
  },
  {
    id: 4,
    title: "Monad Nomads",
    image:
      "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=2074&auto=format&fit=crop",
    price: "FREE",
    items: "400",
    minted: "0%",
    endDate: "Apr 2",
  },
  {
    id: 5,
    title: "Stonad Collection",
    image:
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2074&auto=format&fit=crop",
    price: "FREE",
    items: "45",
    minted: "0%",
    endDate: "Apr 2",
  },
  {
    id: 6,
    title: "Digital Dreams",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop",
    price: "0.5 MON",
    items: "100",
    minted: "0%",
    endDate: "Apr 5",
  },
  {
    id: 7,
    title: "Digital Dreams",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop",
    price: "0.5 MON",
    items: "100",
    minted: "0%",
    endDate: "Apr 5",
  },
];

export default function CaroselV2() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="px-4 md:px-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-tight">
          NFT Drops Calendar
        </h2>
        <Button variant="outline" size="sm">
          See all
        </Button>
      </div>

      <div className="relative -mx-4 px-4">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className="pl-2 md:basis-1/3 lg:basis-1/5"
              >
                <div
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <Card className="overflow-hidden border border-border bg-card/50 text-sm">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className={`object-cover w-full h-full transition-transform duration-500 ${
                          hoveredId === item.id ? "scale-110" : "scale-100"
                        }`}
                      />
                      <div
                        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 h-24 flex items-end transform transition-transform duration-300 ${
                          hoveredId === item.id
                            ? "translate-y-0"
                            : "translate-y-full"
                        }`}
                      >
                        <Button
                          className="w-full text-xs"
                          variant="secondary"
                          size="sm"
                        >
                          Mint Now
                        </Button>
                      </div>
                    </div>
                    <div className="p-2">
                      <h3 className="font-semibold truncate text-sm">
                        {item.title}
                      </h3>
                      <div className="grid grid-cols-3 gap-1 mt-1">
                        <div>
                          <p className="text-xs text-muted-foreground">PRICE</p>
                          <p className="font-medium text-sm">{item.price}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">ITEMS</p>
                          <p className="font-medium text-sm">{item.items}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            MINTED
                          </p>
                          <p className="font-medium text-sm">{item.minted}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        <span className="text-xs">
                          Live
                          <span className="text-muted-foreground">
                            ends: {item.endDate}
                          </span>
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute -left-4 bg-background/80 backdrop-blur-sm hover:bg-background/90" />
          <CarouselNext className="absolute -right-4 bg-background/80 backdrop-blur-sm hover:bg-background/90" />
        </Carousel>
      </div>
    </div>
  );
}
