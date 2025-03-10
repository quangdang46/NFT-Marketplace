import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NFTCollectionsTable } from '@/features/home/components/NftCollections/NFTCollectionsTable';
import { WatchlistTable } from '@/features/home/components/NftCollections/WatchlistTable';
export default function NFTCollectionsv2() {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-bold tracking-tight">Top NFT Collections</h1>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-transparent border-b border-border h-auto p-0 space-x-6">
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
        <TabsContent value="all" className="pt-6">
          <NFTCollectionsTable />
        </TabsContent>
        <TabsContent value="watchlist" className="pt-6">
          <WatchlistTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
