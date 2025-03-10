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
          ? "fixed top-0 left-0 right-0 p-4 z-50 bg-[#1A1F2C]/95"
          : "flex-grow max-w-md mx-4"
      )}
    >
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
          onClick={() => isMobile && setIsSearchFocused(true)}
        />
        <Input
          type="search"
          placeholder="Search collections on Magic Eden"
          className={cn(
            "pl-10 bg-background/50 border-white/10 focus:border-white/20",
            isMobile &&
              !isSearchFocused &&
              "w-8 pl-8 pr-0 opacity-0 pointer-events-none",
            isMobile && isSearchFocused && "w-full opacity-100"
          )}
          onFocus={() => setIsSearchFocused(true)}
        />
        {!isMobile && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
            Ctrl K
          </span>
        )}
        {isMobile && isSearchFocused && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2"
            onClick={() => setIsSearchFocused(false)}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};
