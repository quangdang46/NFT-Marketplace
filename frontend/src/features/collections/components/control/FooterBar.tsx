"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface FooterBarProps {
  itemCount: string;
  sliderValue: number[];
  maxItems: number;
  handleItemCountChange: (value: string) => void;
  handleSliderChange: (value: number[]) => void;
  handleSliderDragStart: () => void;
  handleSliderDragEnd: () => void;
  openCart: () => void;
}

export default function FooterBar({
  itemCount,
  sliderValue,
  maxItems,
  handleItemCountChange,
  handleSliderChange,
  handleSliderDragStart,
  handleSliderDragEnd,
  openCart,
}: FooterBarProps) {
  return (
    <div className="flex items-center justify-between p-3 border-t">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={itemCount}
          onChange={(e) => handleItemCountChange(e.target.value)}
          className="w-20 h-8"
          min="0"
          max={maxItems}
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
      <Button variant="outline" size="icon" className="ml-2" onClick={openCart}>
        <ShoppingCart className="h-4 w-4" />
      </Button>
    </div>
  );
}
