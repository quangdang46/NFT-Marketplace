/* eslint-disable @next/next/no-img-element */
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NFTItem } from "@/types/nft";

interface NFTCardProps {
  item: NFTItem;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function NFTCard({
  item,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: NFTCardProps) {
  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Card className="overflow-hidden border border-border bg-card/50 text-sm">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className={`object-cover w-full h-full transition-transform duration-500 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
          />
          <div
            className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 h-24 flex items-end transform transition-transform duration-300 ${
              isHovered ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <Button className="w-full text-xs" variant="secondary" size="sm">
              Mint Now
            </Button>
          </div>
        </div>
        <div className="p-2">
          <h3 className="font-semibold truncate text-sm">{item.title}</h3>
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
              <p className="text-xs text-muted-foreground">MINTED</p>
              <p className="font-medium text-sm">{item.minted}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            <span className="text-xs">
              Live
              <span className="text-muted-foreground">
                {" "}
                ends: {item.endDate}
              </span>
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
