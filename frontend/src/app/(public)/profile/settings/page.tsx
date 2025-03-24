import { ProfileSettings } from "@/features/profile/ProfileSettings"

export const metadata = {
  title: "Profile Settings | NFT Marketplace",
  description: "Manage your profile settings and preferences",
}

export default function ProfileSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
      <ProfileSettings />
    </div>
  )
}

