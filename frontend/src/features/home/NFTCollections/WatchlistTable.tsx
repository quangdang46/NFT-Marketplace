"use client";

import { NFTCollectionsTable } from "./NFTCollectionsTable";

interface WatchlistTableProps {
  timeframe: string;
}

export function WatchlistTable({ timeframe }: WatchlistTableProps) {
  return (
    <div className="space-y-4">
      <NFTCollectionsTable timeframe={timeframe} />
    </div>
  );
}
