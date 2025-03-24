import { ProfileDetail } from "@/features/profile/ProfileDetail"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserNFTs } from "@/features/profile/UserNFTs"
import { UserActivity } from "@/features/profile/UserActivity"
import { UserCollections } from "@/features/profile/UserCollections"
import { UserFavorites } from "@/features/profile/UserFavorites"

export const metadata = {
  title: "My Profile | NFT Marketplace",
  description: "View and manage your NFT profile, collections, and activity",
}

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <ProfileDetail userId="me" />

      <Tabs defaultValue="nfts" className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl mx-auto">
          <TabsTrigger value="nfts">NFTs</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
        </TabsList>

        <TabsContent value="nfts" className="mt-6">
          <UserNFTs userId="me" />
        </TabsContent>

        <TabsContent value="collections" className="mt-6">
          <UserCollections userId="me" />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <UserActivity userId="me" />
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <UserFavorites userId="me" />
        </TabsContent>

        <TabsContent value="offers" className="mt-6">
          <div className="bg-card p-8 rounded-lg text-center">
            <p className="text-muted-foreground">No active offers at the moment.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

