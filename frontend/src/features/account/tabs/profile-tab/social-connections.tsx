"use client"

import { Button } from "@/components/ui/button"

export default function SocialConnections() {
  return (
    <div>
      <h2 className="text-lg font-medium mb-2">Social Connections</h2>
      <p className="text-gray-400 text-sm mb-2">Social links are displayed on your profile</p>

      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          className="w-full bg-[#2a2a3a] border-[#3a3a4a] hover:bg-[#3a3a4a] text-center py-6 rounded"
        >
          Link X/Twitter
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full bg-[#2a2a3a] border-[#3a3a4a] hover:bg-[#3a3a4a] text-center py-6 rounded"
        >
          Link Discord
        </Button>
      </div>
    </div>
  )
}

