import { MintNFTForm } from "@/features/create/MintNFTForm"

export const metadata = {
  title: "Mint NFT | NFT Marketplace",
  description: "Mint a new NFT on the marketplace",
}

export default function MintNFTPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Mint NFT</h1>
      <MintNFTForm />
    </div>
  )
}

