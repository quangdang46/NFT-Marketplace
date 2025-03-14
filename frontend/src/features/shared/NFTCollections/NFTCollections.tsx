import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { TimeFrameToggle } from "@/features/shared/NFTCollections/TimeFrameToggle";
import { WatchlistTable } from "@/features/shared/NFTCollections/WatchlistTable";
import { NFTCollectionsTable } from "@/features/shared/NFTCollections/NFTCollectionsTable";
export default function NFTCollections() {
  const [timeframe, setTimeframe] = useState("1d");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">
              Top NFT Collections
            </h1>
            <Button variant="outline" className="gap-2">
              See all <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between border-b border-border">
            <Tabs defaultValue="all" className="w-auto">
              <TabsList className="bg-transparent h-auto p-0 space-x-6">
                <TabsTrigger
                  value="all"
                  className="bg-transparent px-0 pb-4 pt-2 font-medium data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  All Collections
                </TabsTrigger>
                <TabsTrigger
                  value="watchlist"
                  className="bg-transparent px-0 pb-4 pt-2 font-medium data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  Watchlist
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <TimeFrameToggle value={timeframe} onValueChange={setTimeframe} />
          </div>

          <Tabs defaultValue="all">
            <TabsContent value="all" className="mt-0">
              <NFTCollectionsTable timeframe={timeframe} />
            </TabsContent>
            <TabsContent value="watchlist" className="mt-0">
              <WatchlistTable timeframe={timeframe} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
