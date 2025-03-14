"use client";

import { useState, useEffect } from "react";
import {
  Grid3x3,
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
  Star,
  Zap,
  ChevronDown,
  Share2,
  Globe,
  X,
  ShoppingCart,
  Moon,
  Sun,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { FilterSidebar } from "./filteredTraits";
import { NFTCard } from "./NFTCard";
import { NFTListItem } from "./NFTListItem";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { CartModal } from "./CartModal";

const mockNFTs = [
  {
    id: "#4599",
    image: "/placeholder.svg",
    price: "0.0276",
    lastPrice: "0.02751",
    selected: true,
    background: "olive",
  },
  {
    id: "#3396",
    image: "/placeholder.svg",
    price: "0.0277",
    lastPrice: "0.02401",
    selected: true,
    background: "teal",
  },
  {
    id: "#1996",
    image: "/placeholder.svg",
    price: "0.02817",
    lastPrice: "",
    selected: true,
    background: "orange",
  },
  {
    id: "#4500",
    image: "/placeholder.svg",
    price: "0.02817",
    lastPrice: "",
    selected: false,
    background: "purple",
  },
  {
    id: "#7437",
    image: "/placeholder.svg",
    price: "0.02817",
    lastPrice: "",
    selected: false,
    background: "beige",
  },
  {
    id: "#8853",
    image: "/placeholder.svg",
    price: "0.0299",
    lastPrice: "",
    selected: false,
    background: "darkred",
  },
  {
    id: "#2506",
    image: "/placeholder.svg",
    price: "0.03",
    lastPrice: "",
    selected: false,
    background: "gold",
  },
  {
    id: "#3207",
    image: "/placeholder.svg",
    price: "0.03235",
    lastPrice: "",
    selected: false,
    background: "gray",
  },
];

// Thêm nhiều NFT hơn để demo
const allNFTs = [
  ...mockNFTs,
  ...Array(16)
    .fill(0)
    .map((_, i) => ({
      id: `#${(10000 + i).toString()}`,
      image: "/placeholder.svg",
      price: (0.03 + i * 0.001).toFixed(5),
      lastPrice: i % 2 === 0 ? (0.029 + i * 0.0005).toFixed(5) : "",
      selected: false,
      background: [
        "olive",
        "teal",
        "orange",
        "purple",
        "beige",
        "darkred",
        "gold",
        "gray",
      ][i % 8],
    })),
];

export function Marketplace() {
  const [view, setView] = useState<"grid" | "list" | "compact">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("low-to-high");
  const [sliderValue, setSliderValue] = useState([100]);
  const [isSliding, setIsSliding] = useState(false);
  const [filteredNFTs, setFilteredNFTs] = useState(allNFTs);
  const [visibleNFTs, setVisibleNFTs] = useState(allNFTs);
  const [priceRange, setPriceRange] = useState<[number, number]>([0.02, 0.04]);
  const { theme, setTheme } = useTheme();
  const [cartOpen, setCartOpen] = useState(false);
  const [itemCount, setItemCount] = useState("0");

  const handleBuy = () => {
    // Implement buy logic here
    setCartOpen(false); // Close the cart modal after "buying"
  };

  // Xử lý thay đổi số lượng item từ input
  const handleItemCountChange = (value: string) => {
    const count = Number.parseInt(value) || 0;
    const normalizedCount = Math.min(Math.max(count, 0), filteredNFTs.length);
    setItemCount(normalizedCount.toString());

    setSliderValue([Math.floor((normalizedCount / filteredNFTs.length) * 100)]);
    setVisibleNFTs(
      filteredNFTs.map((nft, index) => ({
        ...nft,
        selected: index < normalizedCount,
      }))
    );
  };

  const handleNFTSelection = (id: string) => {
    // Cập nhật trạng thái selected của NFT mà không đóng modal
    setVisibleNFTs((prev) =>
      prev.map((nft) =>
        nft.id === id ? { ...nft, selected: !nft.selected } : nft
      )
    );
    updateItemCount();
  };

  // Cập nhật số lượng item được chọn
  const updateItemCount = () => {
    setTimeout(() => {
      const selectedCount = visibleNFTs.filter((nft) => nft.selected).length;
      setItemCount(selectedCount.toString());
      setSliderValue([Math.floor((selectedCount / filteredNFTs.length) * 100)]);
    }, 0);
  };

  // Xử lý tìm kiếm và sắp xếp
  useEffect(() => {
    let result = [...allNFTs];

    // Tìm kiếm
    if (searchTerm) {
      result = result.filter((nft) =>
        nft.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sắp xếp
    switch (sortOption) {
      case "low-to-high":
        result.sort(
          (a, b) => Number.parseFloat(a.price) - Number.parseFloat(b.price)
        );
        break;
      case "high-to-low":
        result.sort(
          (a, b) => Number.parseFloat(b.price) - Number.parseFloat(a.price)
        );
        break;
      case "recent":
        result.sort(
          (a, b) =>
            Number.parseInt(b.id.substring(1)) -
            Number.parseInt(a.id.substring(1))
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            Number.parseInt(a.id.substring(1)) -
            Number.parseInt(b.id.substring(1))
        );
        break;
    }

    setFilteredNFTs(result);
    handleSliderChange(sliderValue);
  }, [searchTerm, sortOption]);

  // Xử lý thay đổi slider
  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    const percentage = value[0] / 100;
    const itemsToShow = Math.max(
      0,
      Math.floor(percentage * filteredNFTs.length)
    );

    setVisibleNFTs(
      filteredNFTs.map((nft, index) => ({
        ...nft,
        selected: index < itemsToShow,
      }))
    );
  };

  const handleSliderDragStart = () => {
    setIsSliding(true);
  };

  const handleSliderDragEnd = () => {
    setIsSliding(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Main Content */}
      <main className="container mx-auto p-0 relative">
        {/* Header */}
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
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
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
              <div className="font-medium text-foreground">
                -265015 to -234984
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span>Pending Transactions</span>
              <div className="font-medium text-foreground">0</div>
            </div>
          </div>
        </header>

        <Tabs defaultValue="items">
          <div className="flex items-center justify-between border-b px-4">
            <TabsList className="bg-transparent p-0">
              <TabsTrigger
                value="items"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Items
              </TabsTrigger>
              <TabsTrigger
                value="offers"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Offers
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                Chart
              </Button>
              <Button variant="ghost" size="sm">
                Analytics
              </Button>
              <Button variant="ghost" size="sm">
                Activity
              </Button>
            </div>
          </div>

          <TabsContent value="items" className="mt-0">
            <div className="flex transition-all duration-300 ease-in-out">
              {/* Updated Filter Sidebar */}
              <div
                className={cn(
                  "w-0 shrink-0 transition-all duration-300 ease-in-out overflow-hidden border-r",
                  showFilters && "w-56"
                )}
              >
                <FilterSidebar
                  onClose={() => setShowFilters(false)}
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                />
              </div>

              <div className="flex-1 transition-all duration-300 ease-in-out">
                <div className="flex flex-col">
                  {/* Controls */}
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
                        <DropdownMenuItem
                          onClick={() => setSortOption("low-to-high")}
                        >
                          Price: Low to High
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setSortOption("high-to-low")}
                        >
                          Price: High to Low
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setSortOption("recent")}
                        >
                          Recently Listed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setSortOption("oldest")}
                        >
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

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-full"
                      >
                        <Image
                          src="/placeholder.svg"
                          alt="Favorite"
                          width={20}
                          height={20}
                        />
                      </Button>
                      <Switch />
                    </div>

                    <Button variant="outline" className="gap-2 ml-auto">
                      <ShoppingCart className="h-4 w-4" />
                      Make Offer
                    </Button>

                    <Button variant="outline" size="icon" className="h-10 w-10">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Content with limited height and scroll */}
                  <div className="h-[calc(100vh-280px)] overflow-y-auto px-3">
                    {view === "list" ? (
                      <div className="px-3">
                        <div className="rounded-lg overflow-hidden border">
                          <div className="flex items-center justify-between bg-muted/50 p-4">
                            <div className="flex items-center gap-2">
                              <Zap className="h-5 w-5" />
                              <div className="text-xl font-bold">0.023 BTC</div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="default"
                                className="bg-pink-600 hover:bg-pink-700"
                              >
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
                            {visibleNFTs.map((nft) => (
                              <NFTListItem key={nft.id} nft={nft} />
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "grid gap-3 transition-all duration-300 ease-in-out",
                          view === "compact"
                            ? showFilters
                              ? "grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7"
                              : "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9"
                            : showFilters
                            ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                            : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7"
                        )}
                      >
                        <div className="bg-muted/20 rounded-lg overflow-hidden border">
                          <div className="p-4 flex flex-col items-center justify-center">
                            <Zap className="h-8 w-8 mb-2" />
                            <div className="text-xl font-bold">
                              Instant Sell
                            </div>
                            <div className="text-2xl font-bold mb-4">
                              0.023 BTC
                            </div>
                            <Button className="w-full bg-pink-600 hover:bg-pink-700">
                              Sell Now
                            </Button>
                            <Button variant="ghost" className="w-full mt-2">
                              View All Offers
                            </Button>
                          </div>
                        </div>

                        {visibleNFTs.map((nft) => (
                          <NFTCard
                            key={nft.id}
                            nft={nft}
                            compact={view === "compact"}
                            isSliding={isSliding}
                            onSelect={() => handleNFTSelection(nft.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer with Interactive Slider */}
                  <div className="flex items-center justify-between p-3 border-t">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={itemCount}
                        onChange={(e) => handleItemCountChange(e.target.value)}
                        className="w-20 h-8"
                        min="0"
                        max={filteredNFTs.length}
                      />
                      <div className="text-muted-foreground">ITEMS</div>
                    </div>
                    <div className="flex-1 px-8">
                      <Slider
                        value={sliderValue}
                        onValueChange={handleSliderChange}
                        onValueCommit={handleSliderDragEnd}
                        max={100}
                        step={1}
                        className="cursor-pointer"
                        onPointerDown={handleSliderDragStart}
                      />
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M12 7V12L15 15"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </Button>
                    <Button className="ml-auto bg-pink-600 hover:bg-pink-700">
                      Connect wallet to buy
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="ml-2"
                      onClick={() => setCartOpen(true)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="offers">
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <h3 className="text-lg font-medium">No Offers Available</h3>
                <p className="text-muted-foreground">
                  There are currently no offers for this collection
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      {/* Cart Modal */}
      <CartModal
        open={cartOpen}
        onOpenChange={setCartOpen}
        items={visibleNFTs.filter((nft) => nft.selected)}
        onRemoveItem={(id) => {
          // Cập nhật trạng thái selected của NFT mà không đóng modal
          setVisibleNFTs((prev) =>
            prev.map((nft) =>
              nft.id === id ? { ...nft, selected: false } : nft
            )
          );
          updateItemCount();
        }}
        onBuy={handleBuy}
      />
    </div>
  );
}
