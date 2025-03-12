"use client";

import type React from "react";

import { useState } from "react";
import { X, ChevronUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";

interface FilterSidebarProps {
  onClose: () => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
}

export default function FilterSidebar({
  onClose,
  priceRange,
  onPriceRangeChange,
}: FilterSidebarProps) {
  const [status, setStatus] = useState("all");
  const [minPrice, setMinPrice] = useState(priceRange[0].toString());
  const [maxPrice, setMaxPrice] = useState(priceRange[1].toString());
  const [searchTraits, setSearchTraits] = useState("");

  // Xử lý thay đổi giá trị min/max
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinPrice(value);
    if (!isNaN(Number.parseFloat(value))) {
      onPriceRangeChange([Number.parseFloat(value), priceRange[1]]);
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxPrice(value);
    if (!isNaN(Number.parseFloat(value))) {
      onPriceRangeChange([priceRange[0], Number.parseFloat(value)]);
    }
  };

  // Danh sách traits được lọc theo từ khóa tìm kiếm
  const traits = [
    { name: "Background", count: 8 },
    { name: "Certificate Series #", count: 5 },
    { name: "Clothes", count: 44 },
    { name: "Color Match", count: 3 },
    { name: "Earring", count: 7 },
    { name: "Eyes", count: 23 },
    { name: "Face", count: 12 },
    { name: "Hat", count: 15 },
    { name: "Mouth", count: 9 },
  ];

  const filteredTraits = searchTraits
    ? traits.filter((trait) =>
        trait.name.toLowerCase().includes(searchTraits.toLowerCase())
      )
    : traits;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-4 border-b">
          <h3 className="text-sm font-medium mb-2 flex items-center justify-between">
            Status
            <ChevronUp className="h-4 w-4" />
          </h3>

          <RadioGroup
            value={status}
            onValueChange={setStatus}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <Label
                htmlFor="show-all"
                className="flex items-center gap-2 cursor-pointer"
              >
                <RadioGroupItem id="show-all" value="all" />
                Show all
              </Label>
              <span className="text-sm text-muted-foreground">10,000</span>
            </div>

            <div className="flex items-center justify-between">
              <Label
                htmlFor="buy-now"
                className="flex items-center gap-2 cursor-pointer"
              >
                <RadioGroupItem id="buy-now" value="buy" />
                Buy now
              </Label>
              <span className="text-sm text-muted-foreground">425</span>
            </div>
          </RadioGroup>
        </div>

        <div className="p-4 border-b">
          <h3 className="text-sm font-medium mb-2 flex items-center justify-between">
            Price
            <ChevronUp className="h-4 w-4" />
          </h3>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="MIN"
                value={minPrice}
                onChange={handleMinPriceChange}
                className="h-9"
              />
              <span>to</span>
              <Input
                type="text"
                placeholder="MAX"
                value={maxPrice}
                onChange={handleMaxPriceChange}
                className="h-9"
              />
            </div>

            <Slider
              value={[
                Number.parseFloat(minPrice) * 100,
                Number.parseFloat(maxPrice) * 100,
              ]}
              min={1}
              max={10}
              step={0.1}
              onValueChange={(values) => {
                const [min, max] = values;
                const newMin = min / 100;
                const newMax = max / 100;
                setMinPrice(newMin.toFixed(4));
                setMaxPrice(newMax.toFixed(4));
                onPriceRangeChange([newMin, newMax]);
              }}
              className="mt-6"
            />
          </div>
        </div>

        <Accordion type="multiple" className="w-full">
          <AccordionItem value="traits" className="border-b">
            <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
              <div className="flex items-center justify-between w-full">
                Traits
                <span className="text-muted-foreground">{traits.length}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <div className="relative mb-2">
                <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search traits"
                  className="pl-8 h-8"
                  value={searchTraits}
                  onChange={(e) => setSearchTraits(e.target.value)}
                />
              </div>
              <div className="space-y-2 mt-2">
                {filteredTraits.map((trait) => (
                  <div
                    key={trait.name}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">{trait.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {trait.count}
                    </span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="background" className="border-b">
            <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
              <div className="flex items-center justify-between w-full">
                Background
                <span className="text-muted-foreground">8</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Blue</span>
                  <span className="text-sm text-muted-foreground">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Green</span>
                  <span className="text-sm text-muted-foreground">15</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Red</span>
                  <span className="text-sm text-muted-foreground">10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Yellow</span>
                  <span className="text-sm text-muted-foreground">8</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="certificate" className="border-b">
            <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
              <div className="flex items-center justify-between w-full">
                Certificate Series #
                <span className="text-muted-foreground">5</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Series 1</span>
                  <span className="text-sm text-muted-foreground">20</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Series 2</span>
                  <span className="text-sm text-muted-foreground">18</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Series 3</span>
                  <span className="text-sm text-muted-foreground">22</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
