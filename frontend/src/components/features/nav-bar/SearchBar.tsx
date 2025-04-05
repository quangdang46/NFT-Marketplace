"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

interface SearchBarProps {
  isMobile: boolean;
}

export const SearchBar = ({ isMobile }: SearchBarProps) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={searchRef}
      className={cn(
        "relative transition-all duration-300",
        isMobile && isSearchFocused
          ? "fixed top-0 left-0 right-0 p-4 z-50 bg-white dark:bg-[#1A1F2C]"
          : "flex-grow max-w-md mx-4"
      )}
    >
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-muted-foreground"
          onClick={() => isMobile && setIsSearchFocused(true)}
        />
        <Input
          type="search"
          placeholder="Search collections on Magic Eden"
          className={cn(
            "pl-10 bg-gray-50 border-gray-200 focus:border-gray-300 text-gray-900 placeholder-gray-500",
            "dark:bg-[#232836] dark:border-white/10 dark:focus:border-white/20 dark:text-white dark:placeholder-gray-400",
            isMobile &&
              !isSearchFocused &&
              "w-8 pl-8 pr-0 opacity-0 pointer-events-none",
            isMobile && isSearchFocused && "w-full opacity-100"
          )}
          onFocus={() => setIsSearchFocused(true)}
        />
        {!isMobile && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 dark:text-muted-foreground">
            Ctrl K
          </span>
        )}
        {isMobile && isSearchFocused && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-white/5"
            onClick={() => setIsSearchFocused(false)}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};
