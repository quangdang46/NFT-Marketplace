"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function TwoFactorAuth() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  return (
    <div>
      <h2 className="text-lg font-medium mb-4 flex items-center">
        <Shield className="mr-2 h-5 w-5 text-[#e91e63]" />
        Two-Factor Authentication (2FA)
      </h2>

      {is2FAEnabled ? (
        <div className="bg-[#2a2a3a] p-4 rounded-md">
          <p className="text-green-400 mb-2">2FA is currently enabled</p>
          <p className="text-gray-400 text-sm mb-4">
            Two-factor authentication adds an additional layer of security to
            your account by requiring more than just a password to sign in.
          </p>
          <Button
            variant="outline"
            className="bg-[#3a3a4a] border-[#4a4a5a] hover:bg-[#4a4a5a]"
            onClick={() => setIs2FAEnabled(false)}
          >
            Disable 2FA
          </Button>
        </div>
      ) : (
        <div className="bg-[#2a2a3a] p-4 rounded-md">
          <p className="text-amber-500 mb-2">2FA is currently disabled</p>
          <p className="text-gray-400 text-sm mb-4">
            Two-factor authentication adds an additional layer of security to
            your account by requiring more than just a password to sign in.
          </p>
          <Button
            className="bg-[#e91e63] hover:bg-[#d81b60]"
            onClick={() => setIs2FAEnabled(true)}
          >
            Enable 2FA
          </Button>
        </div>
      )}
    </div>
  );
}
