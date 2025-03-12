"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NFT } from "@/types/nft";

interface NFTCardProps {
  nft: NFT;
  compact?: boolean;
  isSliding?: boolean;
  onSelect: () => void;
}

export default function NFTCard({
  nft,
  compact = false,
  isSliding = false,
  onSelect,
}: NFTCardProps) {
  // ... (giữ nguyên phần code khác)

  const getBgColor = (bg: string) => {
    switch (bg) {
      case "olive":
        return "bg-olive-800";
      case "teal":
        return "bg-teal-800";
      case "orange":
        return "bg-orange-800";
      case "purple":
        return "bg-purple-900";
      case "beige":
        return "bg-amber-100";
      case "darkred":
        return "bg-red-900";
      case "gold":
        return "bg-amber-700";
      case "gray":
        return "bg-gray-700";
      default:
        return "bg-slate-800";
    }
  };

  return (
    <div
      className={cn(
        "group relative rounded-lg overflow-hidden border transition-all",
        getBgColor(nft.background),
        compact ? "p-1.5" : "p-3",
        nft.selected &&
          "ring-2 ring-pink-500 ring-offset-2 ring-offset-background",
        isSliding && nft.selected && "animate-pulse"
      )}
    >
      <div className="absolute top-1.5 right-1.5 z-10">
        <Button
          variant={nft.selected ? "default" : "secondary"}
          size="icon"
          className={cn(
            "h-6 w-6 rounded-full",
            nft.selected
              ? "bg-pink-600 hover:bg-pink-700"
              : "bg-muted/80 hover:bg-muted"
          )}
          onClick={onSelect}
        >
          {nft.selected ? (
            <Check className="h-3 w-3" />
          ) : (
            <Plus className="h-3 w-3" />
          )}
        </Button>
      </div>

      <div className={cn(compact ? "p-0.5" : "p-1")}>
        <div className="aspect-square overflow-hidden rounded-md">
          <Image
            src={nft.image || "/placeholder.svg"}
            alt={`OCM Genesis ${nft.id}`}
            width={200}
            height={200}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>

        <div className={cn("mt-1.5", compact ? "text-xs" : "text-sm")}>
          <div className="flex items-center justify-between">
            <div className="font-medium text-foreground truncate">
              OCM Genesis {nft.id}
            </div>
            {!compact && (
              <div className="flex items-center gap-0.5">
                <Button variant="ghost" size="icon" className="h-5 w-5">
                  <Image
                    src="/placeholder.svg"
                    alt="Info"
                    width={12}
                    height={12}
                  />
                </Button>
                <Button variant="ghost" size="icon" className="h-5 w-5">
                  <Image
                    src="/placeholder.svg"
                    alt="Copy"
                    width={12}
                    height={12}
                  />
                </Button>
                <Button variant="ghost" size="icon" className="h-5 w-5">
                  <span className="text-[10px] font-medium">+5</span>
                </Button>
              </div>
            )}
          </div>

          <div
            className={cn(
              "mt-0.5 flex items-center justify-between",
              compact ? "text-xs" : "text-sm"
            )}
          >
            <div className="font-bold">{nft.price} BTC</div>
          </div>

          {nft.lastPrice && !compact && (
            <div className="mt-0.5 flex items-center text-[10px] text-muted-foreground">
              <span>Last {nft.lastPrice} BTC</span>
              <Button variant="ghost" size="icon" className="h-5 w-5 ml-auto">
                <Image
                  src="/placeholder.svg"
                  alt="History"
                  width={12}
                  height={12}
                />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
