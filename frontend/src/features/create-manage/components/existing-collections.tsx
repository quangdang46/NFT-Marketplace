"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, Sprout } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Sample collection data
const sampleCollections = [
  { id: "1", name: "Crypto Punks #721", address: "0x8a90...3b9d" },
  { id: "2", name: "Bored Ape Yacht Club", address: "0xbc4c...a79f" },
  { id: "3", name: "Azuki Collection", address: "0x9d23...7e1c" },
  { id: "4", name: "Doodles", address: "0x4672...9f3a" },
]

export default function ExistingCollections() {
  const [hasCollections, setHasCollections] = useState(false);
  const collections = hasCollections ? sampleCollections : [];

  return (
    <Card className="bg-[#111119] border-zinc-800 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">Existing Collections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-400">View your deployed collections on Base</p>
          <div className="flex items-center space-x-2">
            <Switch
              id="demo-mode"
              checked={hasCollections}
              onCheckedChange={setHasCollections}
              className="data-[state=checked]:bg-pink-600"
            />
            <Label htmlFor="demo-mode" className="text-xs text-gray-400">
              Demo: Show Collections
            </Label>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between bg-[#1e1e2d] border-zinc-700 text-white hover:bg-zinc-700 hover:text-white"
            >
              View Collection
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-[100%] bg-[#1e1e2d] border-zinc-700 text-white"
            align="start"
            sideOffset={5}
            style={{ width: "var(--radix-dropdown-trigger-width)" }}
          >
            {collections.length > 0 ? (
              collections.map((collection) => (
                <DropdownMenuItem key={collection.id} className="hover:bg-zinc-700 py-3 px-4 cursor-pointer">
                  <div className="flex flex-col w-full">
                    <span className="font-medium">{collection.name}</span>
                    <span className="text-xs text-gray-400">{collection.address}</span>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="flex flex-col items-center py-6">
                <Sprout className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-400">No collections found for this wallet</p>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  )
}

