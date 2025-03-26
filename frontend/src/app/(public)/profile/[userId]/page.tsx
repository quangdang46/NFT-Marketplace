import { ProfileDetail } from "@/components/features/profile/ProfileDetail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserNFTs } from "@/components/features/profile/UserNFTs";
import { UserActivity } from "@/components/features/profile/UserActivity";
import { UserCollections } from "@/components/features/profile/UserCollections";
import { UserFavorites } from "@/components/features/profile/UserFavorites";
import { notFound } from "next/navigation";

interface ProfilePageProps {
  params: {
    userId: string;
  };
}

export function generateMetadata({ params }: ProfilePageProps) {
  // Validate userId format - allow "me" or user-{number}
  if (params.userId !== "me" && !params.userId.match(/^user-\d+$/)) {
    return {
      title: "User Not Found | NFT Marketplace",
      description: "The requested user profile was not found",
    };
  }

  // In a real app, you would fetch the user data here
  const isOwnProfile = params.userId === "me";
  const displayName = isOwnProfile ? "My Profile" : `User ${params.userId}`;

  return {
    title: `${displayName} | NFT Marketplace`,
    description: `View ${
      isOwnProfile ? "your" : `${displayName}'s`
    } NFT profile, collections, and activity`,
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  // Validate userId format - allow "me" or user-{number}
  if (params.userId !== "me" && !params.userId.match(/^user-\d+$/)) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <ProfileDetail userId={params.userId} />

      <Tabs defaultValue="nfts" className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl mx-auto">
          <TabsTrigger value="nfts">NFTs</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
        </TabsList>

        <TabsContent value="nfts" className="mt-6">
          <UserNFTs userId={params.userId} />
        </TabsContent>

        <TabsContent value="collections" className="mt-6">
          <UserCollections userId={params.userId} />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <UserActivity userId={params.userId} />
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <UserFavorites userId={params.userId} />
        </TabsContent>

        <TabsContent value="offers" className="mt-6">
          <div className="bg-card p-8 rounded-lg text-center">
            <p className="text-muted-foreground">
              No active offers at the moment.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
