"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { X, Search } from "lucide-react";
import { mockChains } from "../../data/mockData";
import Image from "next/image";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filters: any) => void;
}

export function FilterSidebar({
  isOpen,
  onClose,
  onFilterChange,
}: FilterSidebarProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedChains, setSelectedChains] = useState<string[]>([]);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");

  // Apply filters when they change
  const prevFiltersRef = useRef({
    tab: activeTab,
    priceRange,
    chains: selectedChains,
    verified: showVerifiedOnly,
    sort: sortBy,
    search: searchQuery,
  });

  useEffect(() => {
    const currentFilters = {
      tab: activeTab,
      priceRange,
      chains: selectedChains,
      verified: showVerifiedOnly,
      sort: sortBy,
      search: searchQuery,
    };

    // Only call onFilterChange if filters have actually changed
    const prevFilters = prevFiltersRef.current;
    const hasChanged =
      prevFilters.tab !== currentFilters.tab ||
      prevFilters.priceRange[0] !== currentFilters.priceRange[0] ||
      prevFilters.priceRange[1] !== currentFilters.priceRange[1] ||
      prevFilters.chains.length !== currentFilters.chains.length ||
      prevFilters.verified !== currentFilters.verified ||
      prevFilters.sort !== currentFilters.sort ||
      prevFilters.search !== currentFilters.search ||
      prevFilters.chains.some((chain, i) => currentFilters.chains[i] !== chain);

    if (hasChanged) {
      prevFiltersRef.current = currentFilters;
      onFilterChange(currentFilters);
    }
  }, [
    activeTab,
    priceRange,
    selectedChains,
    showVerifiedOnly,
    sortBy,
    searchQuery,
    onFilterChange,
  ]);

  const toggleChain = (chainId: string) => {
    setSelectedChains((prev) => {
      const newChains = prev.includes(chainId)
        ? prev.filter((id) => id !== chainId)
        : [...prev, chainId];
      return newChains;
    });
  };

  const clearFilters = () => {
    setActiveTab("all");
    setPriceRange([0, 100]);
    setSelectedChains([]);
    setShowVerifiedOnly(false);
    setSortBy("recent");
    setSearchQuery("");
  };

  // Improve the responsiveness of the sidebar
  // Ensure it works well on mobile and has proper z-index and transitions

  return (
    <>
      {/* Overlay for mobile - only shows when sidebar is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        id="filter-sidebar"
        className={`fixed md:relative inset-y-0 left-0 z-50 w-[280px] md:w-[280px] bg-background border-r border-border transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } flex flex-col h-full md:h-[calc(100vh-72px)] max-h-screen overflow-hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold">Filters</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Make this div scrollable with a fixed height */}
        <div className="p-4 space-y-6 overflow-y-auto flex-1">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="search"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Type Tabs */}
          <div className="space-y-2">
            <Label>Type</Label>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="nfts">NFTs</TabsTrigger>
                <TabsTrigger value="collections">Collections</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Separator />

          {/* Blockchains */}
          <div className="space-y-3">
            <Label>Blockchains</Label>
            <div className="space-y-2">
              {mockChains.map((chain) => (
                <div key={chain.id} className="flex items-center space-x-2">
                  <Switch
                    id={`chain-${chain.id}`}
                    checked={selectedChains.includes(chain.id)}
                    onCheckedChange={() => toggleChain(chain.id)}
                  />
                  <Label
                    htmlFor={`chain-${chain.id}`}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: chain.color }}
                    >
                      <Image
                        src={
                          chain.icon ||
                          "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
                        }
                        alt={chain.name}
                        width={12}
                        height={12}
                      />
                    </div>
                    <span>{chain.name}</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Verified Only */}
          <div className="flex items-center space-x-2">
            <Switch
              id="verified-only"
              checked={showVerifiedOnly}
              onCheckedChange={setShowVerifiedOnly}
            />
            <Label htmlFor="verified-only">Verified Only</Label>
          </div>

          <Separator />

          {/* Sort By */}
          <div className="space-y-2">
            <Label htmlFor="sort-by">Sort By</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort-by">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently Added</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Fixed footer with price range slider at the bottom */}
        <div className="p-4 border-t border-border mt-auto bg-background">
          {/* Price Range */}
          <div className="space-y-4 mb-4">
            <div className="flex items-center justify-between">
              <Label>Price Range</Label>
              <span className="text-sm text-muted-foreground">
                {priceRange[0]} - {priceRange[1]} ETH
              </span>
            </div>
            <Slider
              defaultValue={[0, 100]}
              max={100}
              step={1}
              value={priceRange}
              onValueChange={setPriceRange}
              className="w-full"
            />
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([Number(e.target.value), priceRange[1]])
                }
                className="w-20 h-8"
                min={0}
                max={priceRange[1]}
              />
              <span>to</span>
              <Input
                type="number"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className="w-20 h-8"
                min={priceRange[0]}
                max={100}
              />
            </div>
          </div>

          <Button onClick={clearFilters} variant="outline" className="w-full">
            Clear All Filters
          </Button>
        </div>
      </div>
    </>
  );
}
