"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, ChevronDown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { TimeFrameToggle } from "@/features/home/components/NftCollections/TimeFrameToggle";

// Types
interface NFTCollection {
  id: number;
  name: string;
  image: string;
  floor: number;
  currency: string;
  topOffer: number;
  floorChange: number;
  volume: number;
  sales: number;
  listed: string;
  priceHistory: { value: number }[];
}

// Fake data generator
const generateFakeData = (): NFTCollection[] => {
  const currencies = ["ETH", "SOL", "POL"];
  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `NFT Collection ${i + 1}`,
    image: `https://source.unsplash.com/50x50/?nft,${i}`,
    floor: Number((Math.random() * 100).toFixed(3)),
    currency: currencies[Math.floor(Math.random() * currencies.length)],
    topOffer: Number((Math.random() * 100).toFixed(3)),
    floorChange: Number((Math.random() * 20 - 10).toFixed(2)),
    volume: Number((Math.random() * 1000).toFixed(2)),
    sales: Math.floor(Math.random() * 100),
    listed: `${Math.floor(Math.random() * 1000)}/${Math.floor(
      Math.random() * 10000
    )}`,
    priceHistory: Array.from({ length: 30 }, () => ({
      value: Number((Math.random() * 100).toFixed(2)),
    })),
  }));
};

export function NFTCollectionsTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<NFTCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("1d");

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData(generateFakeData());
      setLoading(false);
    }, 1500);
  }, [timeframe]);

  const columns: ColumnDef<NFTCollection>[] = [
    {
      accessorKey: "watchlist",
      header: "",
      cell: () => (
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Star className="h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "rank",
      header: "#",
      cell: (info) => info.row.index + 1,
    },
    {
      accessorKey: "collection",
      header: "Collection",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <img
            src={info.row.original.image}
            alt={info.row.original.name}
            className="w-8 h-8 rounded-full"
          />
          <span>{info.row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "floor",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Floor
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => (
        <div>
          {info.row.original.floor} {info.row.original.currency}
        </div>
      ),
    },
    {
      accessorKey: "topOffer",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Top Offer
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => (
        <div>
          {info.row.original.topOffer} {info.row.original.currency}
        </div>
      ),
    },
    {
      accessorKey: "floorChange",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Floor 1d %
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => (
        <div
          className={
            info.row.original.floorChange > 0
              ? "text-green-500"
              : "text-red-500"
          }
        >
          {info.row.original.floorChange > 0 ? "↑" : "↓"}{" "}
          {Math.abs(info.row.original.floorChange)}%
        </div>
      ),
    },
    {
      accessorKey: "volume",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Volume
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => (
        <div>
          {info.row.original.volume} {info.row.original.currency}
        </div>
      ),
    },
    {
      accessorKey: "sales",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Sales
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => info.row.original.sales,
    },
    {
      accessorKey: "listed",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Listed
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => info.row.original.listed,
    },
    {
      accessorKey: "chart",
      header: "Last 1d",
      cell: (info) => (
        <div className="w-32 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={info.row.original.priceHistory}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={
                  info.row.original.floorChange > 0 ? "#22c55e" : "#ef4444"
                }
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <TimeFrameToggle value={timeframe} onValueChange={setTimeframe} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
