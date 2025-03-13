"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { InfoIcon as InfoCircle, Trash2 } from "lucide-react"

type Wallet = {
  id: string
  address: string
  type: string
  isPublic: boolean
  earningStatus: string
  isActive: boolean
}

interface WalletListProps {
  wallets: Wallet[]
}

export default function WalletList({ wallets: initialWallets }: WalletListProps) {
  const [wallets, setWallets] = useState<Wallet[]>(initialWallets)

  const togglePublic = (id: string) => {
    setWallets(wallets.map((wallet) => (wallet.id === id ? { ...wallet, isPublic: !wallet.isPublic } : wallet)))
  }

  return (
    <div className="space-y-6">
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

        {wallets
          .filter((wallet) => wallet.type === "Solana")
          .map((wallet) => (
            <div key={wallet.id} className="grid grid-cols-4 gap-4 py-3 border-t border-[#2a2a3a] items-center">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-purple-500 rounded-full"></div>
                <span>{wallet.address}</span>
              </div>
              <div>
                <Switch
                  checked={wallet.isPublic}
                  onCheckedChange={() => togglePublic(wallet.id)}
                  className="data-[state=checked]:bg-[#e91e63]"
                />
              </div>
              <div>
                <span className="text-amber-500 flex items-center">
                  <span className="mr-1">⚠️</span> {wallet.earningStatus}
                </span>
              </div>
              <div>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-0">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}

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
          <div>Status</div>
        </div>

        {wallets
          .filter((wallet) => wallet.type === "EVM")
          .map((wallet) => (
            <div key={wallet.id} className="grid grid-cols-4 gap-4 py-3 border-t border-[#2a2a3a] items-center">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-purple-500 rounded-full"></div>
                <span>{wallet.address}</span>
              </div>
              <div>
                <Switch
                  checked={wallet.isPublic}
                  onCheckedChange={() => togglePublic(wallet.id)}
                  className="data-[state=checked]:bg-[#e91e63]"
                />
              </div>
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-[#2a2a3a] border-[#3a3a4a] hover:bg-[#3a3a4a] text-xs px-2 py-1 h-auto"
                >
                  {wallet.earningStatus}
                </Button>
              </div>
              <div>
                {wallet.isActive ? (
                  <span className="text-green-500">Active</span>
                ) : (
                  <span className="text-gray-400">Inactive</span>
                )}
              </div>
            </div>
          ))}

        <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0">
          + Link another Ethereum wallet
        </Button>
      </div>
    </div>
  )
}

