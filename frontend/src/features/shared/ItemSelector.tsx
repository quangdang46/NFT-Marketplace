"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"

interface ItemSelectorProps {
  items: any[]
  onSelectionChange: (selectedItems: any[]) => void
  maxSelectable?: number
}

export function ItemSelector({ items, onSelectionChange, maxSelectable = 10 }: ItemSelectorProps) {
  const [selectedItems, setSelectedItems] = useState<any[]>([])
  const [selectionRange, setSelectionRange] = useState([0])
  const [isSelecting, setIsSelecting] = useState(false)
  const prevSelectedItemsRef = useRef("")

  // Update selection based on slider value
  useEffect(() => {
    if (isSelecting) {
      const count = Math.min(selectionRange[0], items.length)
      setSelectedItems(items.slice(0, count))
    }
  }, [selectionRange, items, isSelecting])

  // Notify parent component when selection changes
  useEffect(() => {
    const currentSelectedItems = JSON.stringify(selectedItems)

    // Only call onSelectionChange when selectedItems actually change
    if (prevSelectedItemsRef.current !== currentSelectedItems) {
      prevSelectedItemsRef.current = currentSelectedItems
      onSelectionChange(selectedItems)
    }
  }, [selectedItems, onSelectionChange])

  const toggleSelectionMode = () => {
    setIsSelecting(!isSelecting)
    if (!isSelecting) {
      setSelectionRange([0])
      setSelectedItems([])
    }
  }

  const confirmSelection = () => {
    setIsSelecting(false)
  }

  const cancelSelection = () => {
    setIsSelecting(false)
    setSelectedItems([])
    setSelectionRange([0])
  }

  // Improve the responsiveness of the ItemSelector component

  // Update the component to be more responsive
  return (
    <div className="space-y-3 md:space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant={isSelecting ? "default" : "outline"}
            size="sm"
            onClick={toggleSelectionMode}
            className="text-xs sm:text-sm"
          >
            {isSelecting ? "Selecting..." : "Select Items"}
          </Button>
        </div>

        {selectedItems.length > 0 && (
          <Badge variant="secondary" className="ml-2">
            {selectedItems.length} selected
          </Badge>
        )}
      </div>

      {isSelecting && (
        <div className="space-y-3 md:space-y-4 p-3 md:p-4 bg-card rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span>0</span>
              <span>{items.length}</span>
            </div>
            <Slider max={items.length} step={1} value={selectionRange} onValueChange={setSelectionRange} />
            <div className="text-center text-xs sm:text-sm text-muted-foreground">
              Slide to select {selectionRange[0]} items
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={cancelSelection} className="text-xs sm:text-sm">
              <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Cancel
            </Button>
            <Button size="sm" onClick={confirmSelection} className="text-xs sm:text-sm">
              <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Confirm
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

