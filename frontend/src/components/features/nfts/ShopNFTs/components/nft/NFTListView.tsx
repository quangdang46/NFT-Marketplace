"use client";

import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import NFTListItem from "./NFTListItem";
import type { NFT } from "@/types/nft";

interface NFTListViewProps {
  nfts: NFT[];
}

export default function NFTListView({ nfts }: NFTListViewProps) {
  return (
    <div className="px-3">
      <div className="rounded-lg overflow-hidden border">
        <div className="flex items-center justify-between bg-muted/50 p-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            <div className="text-xl font-bold">0.023 BTC</div>
          </div>
          <div className="flex gap-2">
            <Button variant="default" className="bg-pink-600 hover:bg-pink-700">
              <Zap className="mr-2 h-4 w-4" />
              Instant Sell Now
            </Button>
            <Button variant="outline">View All Offers</Button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 bg-muted/30 px-4 py-2 text-sm font-medium">
          <div>Item</div>
          <div>Listing Price</div>
          <div>Floor Difference</div>
          <div>Owner</div>
          <div>Listed Time</div>
        </div>

        <div className="divide-y">
          {nfts.map((nft) => (
            <NFTListItem key={nft.id} nft={nft} />
          ))}
        </div>
      </div>
    </div>
  );
}
