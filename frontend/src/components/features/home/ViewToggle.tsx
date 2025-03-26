"use client"

import { Grid, List, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ViewToggleProps {
  viewMode: "grid" | "list" | "compact"
  setViewMode: (mode: "grid" | "list" | "compact") => void
}

export function ViewToggle({ viewMode, setViewMode }: ViewToggleProps) {
  return (
    <div className="flex items-center bg-[#1a1a2e] rounded-lg p-1">
      <Button
        variant="ghost"
        size="sm"
        className={`rounded-lg ${viewMode === "grid" ? "bg-[#2a2a3e] text-white" : "text-gray-400 hover:text-white"}`}
        onClick={() => setViewMode("grid")}
        title="Grid View"
      >
        <Grid size={18} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={`rounded-lg ${
          viewMode === "compact" ? "bg-[#2a2a3e] text-white" : "text-gray-400 hover:text-white"
        }`}
        onClick={() => setViewMode("compact")}
        title="Compact Grid"
      >
        <LayoutGrid size={18} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={`rounded-lg ${viewMode === "list" ? "bg-[#2a2a3e] text-white" : "text-gray-400 hover:text-white"}`}
        onClick={() => setViewMode("list")}
        title="List View"
      >
        <List size={18} />
      </Button>
    </div>
  )
}

