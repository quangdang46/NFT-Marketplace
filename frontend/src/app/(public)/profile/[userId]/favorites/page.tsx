import { UserFavorites } from "@/features/profile/UserFavorites"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface UserFavoritesPageProps {
  params: {
    userId: string
  }
}

export function generateMetadata({ params }: UserFavoritesPageProps) {
  // Validate userId format - allow "me" or user-{number}
  if (params.userId !== "me" && !params.userId.match(/^user-\d+$/)) {
    return {
      title: "User Not Found | NFT Marketplace",
      description: "The requested user profile was not found",
    }
  }

  const isOwnProfile = params.userId === "me"
  const displayName = isOwnProfile ? "My" : `User ${params.userId}'s`

  return {
    title: `${displayName} Favorites | NFT Marketplace`,
    description: `View all favorite NFTs by ${displayName.toLowerCase()}`,
  }
}

export default function UserFavoritesPage({ params }: UserFavoritesPageProps) {
  // Validate userId format - allow "me" or user-{number}
  if (params.userId !== "me" && !params.userId.match(/^user-\d+$/)) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href={`/profile/${params.userId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">
          {params.userId === "me" ? "My Favorites" : `Favorites by User ${params.userId}`}
        </h1>
      </div>

      <UserFavorites userId={params.userId} showAll={true} />
    </div>
  )
}

