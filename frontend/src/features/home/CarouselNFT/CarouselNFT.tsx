
/* eslint-disable @next/next/no-img-element */
"use client";

import { HeaderCarousel } from "./components/HeaderCarousel";
import { NFTCarousel } from "./components/NFTCarousel";
import { NFTItem } from "@/types/nft";

const items: NFTItem[] = [
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

export default function CarouselNFT() {
  return (
    <div className="px-4 md:px-6">
      <HeaderCarousel />
      <NFTCarousel items={items} />
    </div>
  );
}
