"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { InfoIcon as InfoCircle } from "lucide-react";
import BlockchainExplorer from "@/features/account/tabs/marketplace-tab/BlockchainExplorer";
import RaritySource from "@/features/account/tabs/marketplace-tab/RaritySource";
export default function MarketplaceTab() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium mb-4">All Chains</h2>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium">Default Click/Tap Behavior</h2>
        <RadioGroup defaultValue="details" className="space-y-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="details"
              id="details"
              className="border-[#e91e63] text-[#e91e63]"
            />
            <Label htmlFor="details">Open Item Details</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="cart"
              id="cart"
              className="border-[#e91e63] text-[#e91e63]"
            />
            <Label htmlFor="cart">Add to Cart</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Solana Section */}
      <div className="space-y-4 pt-4 border-t border-[#2a2a3a]">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
          <h2 className="text-lg font-medium">Solana</h2>
        </div>

        <div>
          <h3 className="text-base font-medium mb-2">Fees Display</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span>Inclusive of all fees</span>
              <InfoCircle className="h-4 w-4 text-gray-400" />
            </div>
            <Switch
              defaultChecked={true}
              className="data-[state=checked]:bg-[#e91e63]"
            />
          </div>
        </div>

        <RaritySource />

        <BlockchainExplorer />
      </div>
    </div>
  );
}
