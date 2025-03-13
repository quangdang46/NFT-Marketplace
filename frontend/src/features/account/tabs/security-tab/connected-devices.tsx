"use client"

import { Button } from "@/components/ui/button"
import { Smartphone } from "lucide-react"

export default function ConnectedDevices() {
  return (
    <div>
      <h2 className="text-lg font-medium mb-4 flex items-center">
        <Smartphone className="mr-2 w-5 h-5 text-[#e91e63]" />
        Connected Devices
      </h2>

      <div className="bg-[#2a2a3a] p-4 rounded-md">
        <p className="text-gray-400 text-sm mb-4">
          Manage devices that are currently connected to your account. You can revoke access for any device that you
           recognize.
        </p>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 border border-[#3a3a4a] rounded-md">
            <div>
              <p className="font-medium">Chrome on Windows</p>
              <p className="text-gray-400 text-sm">Last active: Today at 10:45 AM</p>
            </div>
            <Button variant="outline" size="sm" className="bg-[#3a3a4a] border-[#4a4a5a] hover:bg-[#4a4a5a]">
              Revoke
            </Button>
          </div>

          <div className="flex justify-between items-center p-3 border border-[#3a3a4a] rounded-md">
            <div>
              <p className="font-medium">Safari on iPhone</p>
              <p className="text-gray-400 text-sm">Last active: Yesterday at 8:30 PM</p>
            </div>
            <Button variant="outline" size="sm" className="bg-[#3a3a4a] border-[#4a4a5a] hover:bg-[#4a4a5a]">
              Revoke
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

