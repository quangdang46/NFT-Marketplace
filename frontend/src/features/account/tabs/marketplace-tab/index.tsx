"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { BlockchainExplorer } from "./blockchain-explorer"
import { RaritySource } from "./rarity-source"

export function MarketplaceTab() {
  return (
    <div className="space-y-8 py-6">
      <div>
        <h2 className="text-lg font-medium mb-4">All Chains</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Default Click/Tap Behavior</h3>
            <RadioGroup defaultValue="details">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="details" id="details" />
                <Label htmlFor="details">Open Item Details</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cart" id="cart" />
                <Label htmlFor="cart">Add to Cart</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <h3 className="flex items-center text-sm font-medium mb-3">
              <img src="/solana-logo.svg" alt="Solana" className="w-5 h-5 mr-2" />
              Solana
            </h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Fees Display</h4>
                <div className="flex items-center space-x-2">
                  <Switch id="fees" />
                  <Label htmlFor="fees">Inclusive of all fees</Label>
                </div>
              </div>

              <RaritySource />
              <BlockchainExplorer />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

