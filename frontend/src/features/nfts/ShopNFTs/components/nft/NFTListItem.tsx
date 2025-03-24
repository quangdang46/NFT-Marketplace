import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NFT } from "@/types/nft";

interface NFTListItemProps {
  nft: NFT;
}

export default function NFTListItem({ nft }: NFTListItemProps) {
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

  // Calculate floor difference (mock data)
  const floorDiff = () => {
    const price = Number.parseFloat(nft.price);
    const basePrice = 0.0276;
    const diff = ((price - basePrice) / basePrice) * 100;

    if (diff === 0) return { value: "0.00%", color: "text-foreground" };
    if (diff > 0)
      return { value: `+${diff.toFixed(2)}%`, color: "text-green-500" };
    return { value: `${diff.toFixed(2)}%`, color: "text-red-500" };
  };

  const diff = floorDiff();

  return (
    <div className="grid grid-cols-5 gap-4 items-center p-4">
      <div className="flex items-center gap-3">
        <Button
          variant={nft.selected ? "default" : "outline"}
          size="icon"
          className={cn(
            "h-6 w-6 rounded-full flex-shrink-0",
            nft.selected ? "bg-pink-600 hover:bg-pink-700" : ""
          )}
        >
          {nft.selected && <Check className="h-3 w-3" />}
        </Button>

        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-12 w-12 rounded overflow-hidden flex-shrink-0",
              getBgColor(nft.background)
            )}
          >
            <Image
              src={
                nft.image ||
                "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
              }
              alt={`OCM Genesis ${nft.id}`}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <div className="text-xs text-muted-foreground">#248790</div>
            <div className="font-medium">OCM Genesis {nft.id}</div>
          </div>
        </div>
      </div>

      <div>
        <div className="font-medium">{nft.price} BTC</div>
        <div className="text-xs text-muted-foreground">
          (${(Number.parseFloat(nft.price) * 80000).toFixed(2)})
        </div>
      </div>

      <div className={diff.color}>{diff.value}</div>

      <div className="truncate">bc1p ... {nft.id.slice(-4)}</div>

      <div className="text-muted-foreground">
        {Number.parseInt(nft.id) % 2 === 0
          ? "about 7 hours ago"
          : "about 4 days ago"}
      </div>
    </div>
  );
}
