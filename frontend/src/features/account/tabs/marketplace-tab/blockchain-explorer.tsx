"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function BlockchainExplorer() {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Blockchain Explorer</h3>
      <RadioGroup defaultValue="solscan" className="space-y-3">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="solscan" id="solscan" className="border-[#e91e63] text-[#e91e63]" />
          <Label htmlFor="solscan">
            SolScan <span className="text-teal-500 ml-1">⚪</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="solana-explorer" id="solana-explorer" className="border-[#e91e63] text-[#e91e63]" />
          <Label htmlFor="solana-explorer">
            Solana Explorer <span className="text-blue-500 ml-1">≡</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="solana-fm" id="solana-fm" className="border-[#e91e63] text-[#e91e63]" />
          <Label htmlFor="solana-fm">
            Solana FM <span className="text-purple-500 ml-1">🔍</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}

