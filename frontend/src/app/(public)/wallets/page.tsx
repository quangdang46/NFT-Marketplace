import { WalletsList } from "@/features/wallets/WalletsList"

export const metadata = {
  title: "Wallet Addresses | NFT Marketplace",
  description: "Browse wallet addresses on the NFT marketplace",
}

export default function WalletsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Wallet Addresses</h1>
      <p className="text-muted-foreground mb-6">
        Browse wallet addresses on the NFT marketplace. Click on an address to view their profile.
      </p>
      <WalletsList />
    </div>
  )
}

