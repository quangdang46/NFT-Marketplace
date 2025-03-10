"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Star } from "lucide-react";
import Image from "next/image";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

type TimeRange = "10m" | "1h" | "6h" | "1d" | "7d" | "30d";

const WATCHLIST_COLLECTIONS = [
  {
    id: 6,
    name: "Bored Ape Yacht Club",
    image: "https://i.imgur.com/nZZrGnU.png",
    floor: "32.5 ETH",
    topOffer: "31.8 ETH",
    floorChange: 2.8,
    volume: "1.2K ETH",
    sales: "156",
    listed: "6.2%",
    listedDetails: "620 / 10,000",
    chartData: {},
  },
  {
    id: 7,
    name: "Azuki",
    image: "https://i.imgur.com/xqQJHqu.png",
    floor: "8.9 ETH",
    topOffer: "8.7 ETH",
    floorChange: -1.5,
    volume: "456 ETH",
    sales: "89",
    listed: "4.8%",
    listedDetails: "480 / 10,000",
    chartData: {},
  },
];

const COLLECTIONS = [
  {
    id: 1,
    name: "Courtyard.io",
    image: "https://i.imgur.com/7D7I6dI.png",
    floor: "27 POL",
    topOffer: "0.887 POL",
    floorChange: null,
    volume: "2.6M POL",
    sales: "10.9K",
    listed: "8.1%",
    listedDetails: "9,717 / 120.0K",
    chartData: {
      "10m": Array.from({ length: 20 }, (_, i) => ({
        value: 25 + Math.sin(i / 3) * 2,
      })),
      "1h": Array.from({ length: 20 }, (_, i) => ({
        value: 26 + Math.cos(i / 2) * 3,
      })),
      "6h": Array.from({ length: 20 }, (_, i) => ({
        value: 24 + Math.sin(i / 4) * 4,
      })),
      "1d": Array.from({ length: 20 }, (_, i) => ({
        value: 25 + Math.random() * 4,
      })),
      "7d": Array.from({ length: 20 }, (_, i) => ({ value: 23 + i / 2 })),
      "30d": Array.from({ length: 20 }, (_, i) => ({ value: 20 + i / 3 })),
    },
  },
  {
    id: 2,
    name: "Pudgy Penguins",
    image: "https://i.imgur.com/QnmqI8F.png",
    floor: "9.4 ETH",
    topOffer: "9.24 ETH",
    floorChange: -2.2,
    volume: "289 ETH",
    sales: "30",
    listed: "3.8%",
    listedDetails: "337 / 8,888",
    chartData: {
      "10m": Array.from({ length: 20 }, (_, i) => ({
        value: 9.2 + Math.sin(i / 2) * 0.2,
      })),
      "1h": Array.from({ length: 20 }, (_, i) => ({
        value: 9.3 + Math.cos(i / 3) * 0.3,
      })),
      "6h": Array.from({ length: 20 }, (_, i) => ({
        value: 9.1 + Math.sin(i / 4) * 0.4,
      })),
      "1d": Array.from({ length: 20 }, (_, i) => ({
        value: 8 + Math.random() * 3,
      })),
      "7d": Array.from({ length: 20 }, (_, i) => ({ value: 8.5 + i / 10 })),
      "30d": Array.from({ length: 20 }, (_, i) => ({ value: 7 + i / 5 })),
    },
  },
  {
    id: 3,
    name: "Oracle Patron NFT",
    image: "https://i.imgur.com/Z7rDnjZ.png",
    floor: "0.22 ETH",
    topOffer: "0.205 ETH",
    floorChange: -21.0,
    volume: "95.55 ETH",
    sales: "327",
    listed: "2.8%",
    listedDetails: "422 / 15.1K",
    chartData: {
      "10m": Array.from({ length: 20 }, (_, i) => ({
        value: 0.21 + Math.sin(i / 2) * 0.01,
      })),
      "1h": Array.from({ length: 20 }, (_, i) => ({
        value: 0.22 + Math.cos(i / 3) * 0.02,
      })),
      "6h": Array.from({ length: 20 }, (_, i) => ({
        value: 0.2 + Math.sin(i / 4) * 0.03,
      })),
      "1d": Array.from({ length: 20 }, (_, i) => ({
        value: 0.18 + Math.random() * 0.08,
      })),
      "7d": Array.from({ length: 20 }, (_, i) => ({ value: 0.15 + i / 100 })),
      "30d": Array.from({ length: 20 }, (_, i) => ({ value: 0.12 + i / 50 })),
    },
  },
  {
    id: 4,
    name: "Doodles",
    image: "https://i.imgur.com/1D7fw4K.png",
    floor: "3.069 ETH",
    topOffer: "2.95 ETH",
    floorChange: -4.1,
    volume: "89.63 ETH",
    sales: "29",
    listed: "4.5%",
    listedDetails: "445 / 9,998",
    chartData: {
      "10m": Array.from({ length: 20 }, (_, i) => ({
        value: 3.0 + Math.sin(i / 2) * 0.1,
      })),
      "1h": Array.from({ length: 20 }, (_, i) => ({
        value: 3.1 + Math.cos(i / 3) * 0.2,
      })),
      "6h": Array.from({ length: 20 }, (_, i) => ({
        value: 2.9 + Math.sin(i / 4) * 0.3,
      })),
      "1d": Array.from({ length: 20 }, (_, i) => ({
        value: 2.8 + Math.random() * 0.5,
      })),
      "7d": Array.from({ length: 20 }, (_, i) => ({ value: 2.5 + i / 20 })),
      "30d": Array.from({ length: 20 }, (_, i) => ({ value: 2.0 + i / 10 })),
    },
  },
  {
    id: 5,
    name: "DeGods",
    image: "https://i.imgur.com/YCkQhwK.png",
    floor: "12.5 ETH",
    topOffer: "12.1 ETH",
    floorChange: 5.3,
    volume: "456.2 ETH",
    sales: "42",
    listed: "5.2%",
    listedDetails: "548 / 10,512",
    chartData: {
      "10m": Array.from({ length: 20 }, (_, i) => ({
        value: 12.3 + Math.sin(i / 2) * 0.3,
      })),
      "1h": Array.from({ length: 20 }, (_, i) => ({
        value: 12.4 + Math.cos(i / 3) * 0.4,
      })),
      "6h": Array.from({ length: 20 }, (_, i) => ({
        value: 12.2 + Math.sin(i / 4) * 0.5,
      })),
      "1d": Array.from({ length: 20 }, (_, i) => ({
        value: 11 + Math.random() * 2,
      })),
      "7d": Array.from({ length: 20 }, (_, i) => ({ value: 10 + i / 5 })),
      "30d": Array.from({ length: 20 }, (_, i) => ({ value: 9 + i / 2 })),
    },
  },
];

export function NFTCollections() {
  const [timeRange, setTimeRange] = useState<TimeRange>("1d");
  const [activeTab, setActiveTab] = useState<"top" | "watchlist">("top");
  const [watchlist, setWatchlist] = useState<Set<number>>(new Set([6, 7]));

  const toggleWatchlist = (id: number) => {
    const newWatchlist = new Set(watchlist);
    if (watchlist.has(id)) {
      newWatchlist.delete(id);
    } else {
      newWatchlist.add(id);
    }
    setWatchlist(newWatchlist);
  };

  const displayCollections =
    activeTab === "top" ? COLLECTIONS : WATCHLIST_COLLECTIONS;

  return (
    <section className="py-8 px-4">
      <div className="mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              className={`relative px-0 font-semibold ${
                activeTab === "top"
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                  : ""
              }`}
              onClick={() => setActiveTab("top")}
            >
              Top NFT Collections
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`relative px-0 font-semibold ${
                activeTab === "watchlist"
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                  : ""
              }`}
              onClick={() => setActiveTab("watchlist")}
            >
              Watchlist
              {watchlist.size > 0 && (
                <span className="ml-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                  {watchlist.size}
                </span>
              )}
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            {(["10m", "1h", "6h", "1d", "7d", "30d"] as TimeRange[]).map(
              (range) => (
                <Button
                  key={range}
                  variant="ghost"
                  size="sm"
                  className={`px-3 ${
                    timeRange === range
                      ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                      : ""
                  }`}
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </Button>
              )
            )}
          </div>
        </div>

        <div className="rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-0">
                <TableHead className="w-12"></TableHead>
                <TableHead>Collection</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Top Offer</TableHead>
                <TableHead>Floor 1d %</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Listed</TableHead>
                <TableHead className="w-[140px]">Last {timeRange}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayCollections.map((collection) => (
                <TableRow
                  key={collection.id}
                  className="group hover:bg-card/50 border-0"
                >
                  <TableCell className="py-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      onClick={() => toggleWatchlist(collection.id)}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          watchlist.has(collection.id)
                            ? "fill-primary text-primary"
                            : "fill-none"
                        }`}
                      />
                    </Button>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative h-8 w-8 rounded-full overflow-hidden">
                        <Image
                          src={collection.image}
                          alt={collection.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-medium">{collection.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">{collection.floor}</TableCell>
                  <TableCell className="py-4">{collection.topOffer}</TableCell>
                  <TableCell className="py-4">
                    {collection.floorChange ? (
                      <span
                        className={
                          collection.floorChange < 0
                            ? "text-red-500"
                            : "text-green-500"
                        }
                      >
                        {collection.floorChange > 0 ? "+" : ""}
                        {collection.floorChange}%
                      </span>
                    ) : (
                      "--"
                    )}
                  </TableCell>
                  <TableCell className="py-4">{collection.volume}</TableCell>
                  <TableCell className="py-4">{collection.sales}</TableCell>
                  <TableCell className="py-4">
                    <div>
                      <div>{collection.listed}</div>
                      <div className="text-xs text-muted-foreground">
                        {collection.listedDetails}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    {collection.chartData[timeRange] ? (
                      <div className="w-[140px] h-10">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={collection.chartData[timeRange]}>
                            <defs>
                              <linearGradient
                                id={`gradient-${collection.id}-${timeRange}`}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="0%"
                                  stopColor={
                                    collection.floorChange &&
                                    collection.floorChange < 0
                                      ? "#ef4444"
                                      : "#22c55e"
                                  }
                                  stopOpacity={0.2}
                                />
                                <stop
                                  offset="100%"
                                  stopColor={
                                    collection.floorChange &&
                                    collection.floorChange < 0
                                      ? "#ef4444"
                                      : "#22c55e"
                                  }
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <Area
                              type="monotone"
                              dataKey="value"
                              stroke={
                                collection.floorChange &&
                                collection.floorChange < 0
                                  ? "#ef4444"
                                  : "#22c55e"
                              }
                              fill={`url(#gradient-${collection.id}-${timeRange})`}
                              strokeWidth={1.5}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="w-[140px] h-10 flex items-center justify-center text-muted-foreground">
                        No data
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
