"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { allNFTs } from "@/lib/constant/allNFTs";
import { useNFTSelection } from "@/hooks/use-nft-selection";
import ControlBar from "./components/control/ControlBar";
import FooterBar from "./components/control/FooterBar";
import NFTListView from "./components/nft/NFTListView";
import NFTGrid from "./components/nft/NFTGrid";
import CartModal from "./components/cart/CartModal";
import InformationNFT from "./components/nft/InformationNFT";
import FilterSidebar from "./components/filter/FilterSidebar";

export default function ShopNFTs() {
  const [view, setView] = useState<"grid" | "list" | "compact">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("low-to-high");
  const [filteredNFTs, setFilteredNFTs] = useState(allNFTs);
  const [visibleNFTs, setVisibleNFTs] = useState(allNFTs);
  const [priceRange, setPriceRange] = useState<[number, number]>([0.02, 0.04]);
  const [cartOpen, setCartOpen] = useState(false);

  // Sử dụng useNFTSelection để quản lý itemCount và slider
  const {
    itemCount,
    sliderValue,
    isSliding,
    handleItemCountChange,
    handleSliderChange,
    handleSliderDragStart,
    handleSliderDragEnd,
  } = useNFTSelection({
    initialNFTs: filteredNFTs,
    onVisibleNFTsChange: setVisibleNFTs,
  });

  const handleBuy = () => {
    setCartOpen(false);
  };

  const handleRemoveItem = (id: string) => {
    setVisibleNFTs((prev) =>
      prev.map((nft) => (nft.id === id ? { ...nft, selected: false } : nft))
    );
    updateItemCount();
  };

  const handleNFTSelection = (id: string) => {
    setVisibleNFTs((prev) =>
      prev.map((nft) =>
        nft.id === id ? { ...nft, selected: !nft.selected } : nft
      )
    );
    updateItemCount();
  };

  const updateItemCount = () => {
    setTimeout(() => {
      const selectedCount = visibleNFTs.filter((nft) => nft.selected).length;
      handleItemCountChange(selectedCount.toString());
    }, 0);
  };

  useEffect(() => {
    let result = [...allNFTs];

    // Lọc theo searchTerm
    if (searchTerm) {
      result = result.filter((nft) =>
        nft.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sắp xếp theo sortOption
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

    // Cập nhật filteredNFTs
    setFilteredNFTs(result);

    // Cập nhật visibleNFTs dựa trên filteredNFTs
    setVisibleNFTs((prev) => {
      // Tạo một map để lưu trạng thái selected của các NFT hiện tại
      const selectedMap = new Map(prev.map((nft) => [nft.id, nft.selected]));

      // Cập nhật visibleNFTs dựa trên filteredNFTs, giữ trạng thái selected
      return result.map((nft) => ({
        ...nft,
        selected: selectedMap.has(nft.id) ? selectedMap.get(nft.id)! : false,
      }));
    });

    // Không gọi handleSliderChange ở đây để tránh vòng lặp
  }, [searchTerm, sortOption]); // Chỉ phụ thuộc vào searchTerm và sortOption

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Main Content */}
      <main className="container mx-auto p-0 relative">
        <InformationNFT />

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
                  <ControlBar
                    view={view}
                    setView={setView}
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    sortOption={sortOption}
                    setSortOption={setSortOption}
                    openCart={() => setCartOpen(true)}
                  />

                  {/* Content with limited height and scroll */}
                  <div className="h-[calc(100vh-280px)] overflow-y-auto px-3">
                    {view === "list" ? (
                      <NFTListView nfts={visibleNFTs} />
                    ) : (
                      <NFTGrid
                        nfts={visibleNFTs}
                        view={view === "compact" ? "compact" : "grid"}
                        showFilters={showFilters}
                        isSliding={isSliding}
                        onSelect={handleNFTSelection}
                      />
                    )}
                  </div>

                  <FooterBar
                    itemCount={itemCount}
                    sliderValue={sliderValue}
                    maxItems={filteredNFTs.length}
                    handleItemCountChange={handleItemCountChange}
                    handleSliderChange={handleSliderChange}
                    handleSliderDragStart={handleSliderDragStart}
                    handleSliderDragEnd={handleSliderDragEnd}
                    openCart={() => setCartOpen(true)}
                  />
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
      <CartModal
        open={cartOpen}
        onOpenChange={setCartOpen}
        items={visibleNFTs.filter((nft) => nft.selected)}
        onRemoveItem={handleRemoveItem}
        onBuy={handleBuy}
      />
    </div>
  );
}
