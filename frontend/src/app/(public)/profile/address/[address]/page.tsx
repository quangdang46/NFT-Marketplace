import { ProfileDetail } from "@/features/profile/ProfileDetail"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserNFTs } from "@/features/profile/UserNFTs"
import { UserActivity } from "@/features/profile/UserActivity"
import { UserCollections } from "@/features/profile/UserCollections"
import { UserFavorites } from "@/features/profile/UserFavorites"
import { notFound } from "next/navigation"

interface ProfileAddressPageProps {
  params: {
    address: string
  }
}

export function generateMetadata({ params }: ProfileAddressPageProps) {
  // Validate address format - should be a valid Ethereum-like address
  // const isValidAddress =
  //   params.address &&
  //   (params.address.startsWith("0x") ||
  //     // For demo purposes, allow some test addresses
  //     params.address.match(/^(0x)?[0-9a-fA-F]{40}$/))

  // if (!isValidAddress) {
  //   return {
  //     title: "Address Not Found | NFT Marketplace",
  //     description: "The requested wallet address was not found",
  //   }
  // }

  return {
    title: `Profile ${params.address} | NFT Marketplace`,
    description: `View NFT profile, collections, and activity for ${params.address}`,
  }
}

export default function ProfileAddressPage({ params }: ProfileAddressPageProps) {
  // Validate address format - should be a valid Ethereum-like address
  // const isValidAddress =
  //   params.address &&
  //   (params.address.startsWith("0x") ||
  //     // For demo purposes, allow some test addresses
  //     params.address.match(/^(0x)?[0-9a-fA-F]{40}$/))

  // if (!isValidAddress) {
  //   notFound()
  // }

  return (
    <div className="space-y-8">
      <ProfileDetail userId={params.address} />

      <Tabs defaultValue="nfts" className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl mx-auto">
          <TabsTrigger value="nfts">NFTs</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
        </TabsList>

        <TabsContent value="nfts" className="mt-6">
          <UserNFTs userId={params.address} />
        </TabsContent>

        <TabsContent value="collections" className="mt-6">
          <UserCollections userId={params.address} />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <UserActivity userId={params.address} />
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <UserFavorites userId={params.address} />
        </TabsContent>

        <TabsContent value="offers" className="mt-6">
          <div className="bg-card p-8 rounded-lg text-center">
            <p className="text-muted-foreground">No active offers for this user.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

