"use client";

import {
  Grid3x3,
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
  Zap,
  ChevronDown,
  Share2,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ControlBarProps {
  view: "grid" | "list" | "compact";
  setView: (view: "grid" | "list" | "compact") => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  openCart: () => void;
}

export default function ControlBar({
  view,
  setView,
  showFilters,
  setShowFilters,
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption,
}: ControlBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-3">
      <Button
        variant={showFilters ? "default" : "outline"}
        size="icon"
        onClick={() => setShowFilters(!showFilters)}
        className="h-10 w-10"
      >
        <SlidersHorizontal className="h-4 w-4" />
      </Button>

      <Button
        variant={view === "compact" ? "default" : "outline"}
        size="icon"
        onClick={() => setView("compact")}
        className="h-10 w-10"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>

      <Button
        variant={view === "grid" ? "default" : "outline"}
        size="icon"
        onClick={() => setView("grid")}
        className="h-10 w-10"
      >
        <Grid3x3 className="h-4 w-4" />
      </Button>

      <Button
        variant={view === "list" ? "default" : "outline"}
        size="icon"
        onClick={() => setView("list")}
        className="h-10 w-10"
      >
        <List className="h-4 w-4" />
      </Button>

      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search items"
          className="pl-9 h-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            {sortOption === "low-to-high" && "Price: Low to High"}
            {sortOption === "high-to-low" && "Price: High to Low"}
            {sortOption === "recent" && "Recently Listed"}
            {sortOption === "oldest" && "Oldest"}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setSortOption("low-to-high")}>
            Price: Low to High
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortOption("high-to-low")}>
            Price: High to Low
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortOption("recent")}>
            Recently Listed
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortOption("oldest")}>
            Oldest
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-purple-500" />
              Show Pending
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Show All</DropdownMenuItem>
          <DropdownMenuItem>Show Pending Only</DropdownMenuItem>
          <DropdownMenuItem>Hide Pending</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="outline" className="gap-2 ml-auto">
        <ShoppingCart className="h-4 w-4" />
        Make Offer
      </Button>

      <Button variant="outline" size="icon" className="h-10 w-10">
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
