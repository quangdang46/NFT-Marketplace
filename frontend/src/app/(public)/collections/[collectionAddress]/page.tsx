import { CollectionDetail } from "@/features/collections/CollectionDetail"
import { NFTGrid } from "@/features/nfts/NFTGrid"
import { notFound } from "next/navigation"

interface CollectionDetailPageProps {
  params: {
    collectionAddress: string
  }
}

export function generateMetadata({ params }: CollectionDetailPageProps) {
  // In a real app, you would fetch the collection data here
  return {
    title: `Collection ${params.collectionAddress} | NFT Marketplace`,
    description: `View details and NFTs in collection ${params.collectionAddress}`,
  }
}

export default function CollectionDetailPage({ params }: CollectionDetailPageProps) {
  // Validate collection address format
  if (!params.collectionAddress || !params.collectionAddress.match(/^collection-\d+$/)) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <CollectionDetail collectionId={params.collectionAddress} />
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">NFTs in this Collection</h2>
        <NFTGrid collectionId={params.collectionAddress} />
      </div>
    </div>
  )
}

