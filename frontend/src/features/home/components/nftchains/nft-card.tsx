"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface NFTCardProps {
  title: string;
  image: string;
  collection: string;
  currency: string;
  description: string;
}

export function NFTCard({
  title,
  image,
  collection,
  currency,
  description,
}: NFTCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-xl transition-all duration-300",
        "cursor-pointer transform hover:scale-[1.02]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square relative">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/80 to-transparent",
            "opacity-0 transition-opacity duration-300",
            isHovered && "opacity-100"
          )}
        />
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 p-4 text-white",
            "transform translate-y-full transition-transform duration-300",
            isHovered && "translate-y-0"
          )}
        >
          <h3 className="text-xl font-bold mb-1">{title}</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">
              {collection}
            </span>
            <span className="text-sm bg-[#F7931A]/20 px-2 py-0.5 rounded-full">
              {currency}
            </span>
          </div>
          <p className="text-sm text-white/80 line-clamp-2">{description}</p>
        </div>
      </div>
    </Card>
  );
}
