"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { InfoIcon as InfoCircle, Trash2 } from "lucide-react"

type WalletType = {
  id: string
  address: string
  type: string
  isPublic: boolean
  status: string
}

export default function WalletsTab() {
  const [wallets, setWallets] = useState<WalletType[]>([
    {
      id: "1",
      address: "AzriPSB...Hjq",
      type: "Solana",
      isPublic: false,
      status: "Stake to Start Earning",
    },
    {
      id: "2",
      address: "0x35FE6...7e8",
      type: "EVM",
      isPublic: false,
      status: "Link to earn",
    },
  ])

  const togglePublic = (id: string) => {
    setWallets(wallets.map((wallet) => (wallet.id === id ? { ...wallet, isPublic: !wallet.isPublic } : wallet)))
  }

  return (
    <div className="space-y-6">
      <div className="text-amber-500 text-sm">
        <p>All your wallets are set to private. At least one wallet must be public for others to see your profile.</p>
      </div>

      {/* Solana Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
          <h2 className="text-lg font-medium">Solana</h2>
        </div>

        <div className="grid grid-cols-4 gap-4 py-2 text-sm text-gray-400">
          <div>Wallet</div>
          <div className="flex items-center">
            Public <InfoCircle className="ml-1 h-4 w-4" />
          </div>
          <div className="flex items-center">
            Earning <span className="ml-1 text-pink-500">✨</span>
          </div>
          <div>Remove</div>
        </div>

        <div className="grid grid-cols-4 gap-4 py-3 border-t border-[#2a2a3a] items-center">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-purple-500 rounded-full"></div>
            <span>{wallets[0].address}</span>
          </div>
          <div>
            <Switch
              checked={wallets[0].isPublic}
              onCheckedChange={() => togglePublic(wallets[0].id)}
              className="data-[state=checked]:bg-[#e91e63]"
            />
          </div>
          <div>
            <span className="text-amber-500 flex items-center">
              <span className="mr-1">⚠️</span> {wallets[0].status}
            </span>
          </div>
          <div>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-0">
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0">
          + Link another Solana wallet
        </Button>
      </div>

      {/* EVM Section */}
      <div className="space-y-4 mt-8">
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-1">
            <div className="w-5 h-5 bg-blue-500 rounded-full z-10"></div>
            <div className="w-5 h-5 bg-red-500 rounded-full z-20"></div>
            <div className="w-5 h-5 bg-yellow-500 rounded-full z-30"></div>
          </div>
          <h2 className="text-lg font-medium">EVM</h2>
        </div>

        <div className="grid grid-cols-4 gap-4 py-2 text-sm text-gray-400">
          <div>Wallet</div>
          <div className="flex items-center">
            Public <InfoCircle className="ml-1 h-4 w-4" />
          </div>
          <div className="flex items-center">
            Earning <span className="ml-1 text-pink-500">✨</span>
          </div>
          <div>Remove</div>
        </div>

        <div className="grid grid-cols-4 gap-4 py-3 border-t border-[#2a2a3a] items-center">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-purple-500 rounded-full"></div>
            <span>{wallets[1].address}</span>
          </div>
          <div>
            <Switch
              checked={wallets[1].isPublic}
              onCheckedChange={() => togglePublic(wallets[1].id)}
              className="data-[state=checked]:bg-[#e91e63]"
            />
          </div>
          <div>
            <Button
              variant="outline"
              size="sm"
              className="bg-[#2a2a3a] border-[#3a3a4a] hover:bg-[#3a3a4a] text-xs px-2 py-1 h-auto"
            >
              {wallets[1].status}
            </Button>
          </div>
          <div>
            <span className="text-green-500">Active</span>
          </div>
        </div>

        <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0">
          + Link another Ethereum wallet
        </Button>
      </div>
    </div>
  )
}

