"use client";

import { Star, ChevronDown, Share2, Globe, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function InformationNFT() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Image
            src="/placeholder.svg"
            alt="OCM Genesis"
            width={36}
            height={36}
            className="rounded-full"
          />
          <div>
            <h1 className="text-lg font-semibold flex items-center gap-2">
              OCM Genesis (BTC) by OnChainMonkey®
              <Star className="h-4 w-4" />
            </h1>
            <div className="flex items-center gap-2 text-sm">
              <Button variant="outline" size="sm" className="h-7 gap-1">
                Info <ChevronDown className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" className="h-7 gap-1">
                Share Stats <Share2 className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <Globe className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <Image
                  src="/placeholder.svg"
                  alt="Discord"
                  width={16}
                  height={16}
                />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-7 px-4 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <span>Floor Price</span>
          <div className="font-medium text-foreground">0.0276 BTC</div>
        </div>
        <div className="flex items-center gap-1">
          <span>All Vol</span>
          <div className="font-medium text-foreground">98.4207 BTC</div>
        </div>
        <div className="flex items-center gap-1">
          <span>Owners</span>
          <div className="font-medium text-foreground">2.7K</div>
        </div>
        <div className="flex items-center gap-1">
          <span>Listed</span>
          <div className="font-medium text-foreground">425</div>
        </div>
        <div className="flex items-center gap-1">
          <span>Total Supply</span>
          <div className="font-medium text-foreground">10K</div>
        </div>
        <div className="flex items-center gap-1">
          <span>Range</span>
          <div className="font-medium text-foreground">-265015 to -234984</div>
        </div>
        <div className="flex items-center gap-1">
          <span>Pending Transactions</span>
          <div className="font-medium text-foreground">0</div>
        </div>
      </div>
    </header>
  );
}
