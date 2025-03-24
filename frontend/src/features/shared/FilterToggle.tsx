"use client"

import { Button } from "@/components/ui/button"
import { SlidersHorizontal } from "lucide-react"

interface FilterToggleProps {
  onClick: () => void
  isOpen: boolean
}

export function FilterToggle({ onClick, isOpen }: FilterToggleProps) {
  // Make sure the toggle button is more visible and works properly
  // Change the button to be more prominent and ensure it works on all devices

  // Update the button to have a more distinct appearance
  // Make the toggle button more responsive and visible on all screen sizes
  // Ensure it has proper padding and is easily clickable on mobile

  return (
    <Button
      variant={isOpen ? "default" : "outline"}
      size="sm"
      className="flex items-center gap-2 md:inline-flex min-w-[120px] md:min-w-[140px] justify-center"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-controls="filter-sidebar"
    >
      <SlidersHorizontal className="h-4 w-4" />
      <span>{isOpen ? "Hide Filters" : "Show Filters"}</span>
    </Button>
  )
}

