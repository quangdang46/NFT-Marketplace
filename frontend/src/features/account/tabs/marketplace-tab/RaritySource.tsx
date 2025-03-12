import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React from "react";

export default function RaritySource() {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Rarity Source</h3>
      <RadioGroup defaultValue="moonrank" className="space-y-3">
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="moonrank"
            id="moonrank"
            className="border-[#e91e63] text-[#e91e63]"
          />
          <Label htmlFor="moonrank">MoonRank</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="howrare"
            id="howrare"
            className="border-[#e91e63] text-[#e91e63]"
          />
          <Label htmlFor="howrare">HowRare</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
