"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from "@/features/account/tabs/profile-tab";
import WalletsTab from "@/features/account/tabs/wallets-tab";
import MarketplaceTab from "@/features/account/tabs/marketplace-tab";
import SecurityTab from "@/features/account/tabs/security-tab";

export default function Account() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="bg-transparent border-b border-[#2a2a3a] w-full justify-start rounded-none p-0 h-auto">
          <TabsTrigger
            value="profile"
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#e91e63] data-[state=active]:text-white data-[state=active]:bg-transparent rounded-none"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="wallets"
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#e91e63] data-[state=active]:text-white data-[state=active]:bg-transparent rounded-none"
          >
            Wallets
          </TabsTrigger>
          <TabsTrigger
            value="marketplace"
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#e91e63] data-[state=active]:text-white data-[state=active]:bg-transparent rounded-none"
          >
            Marketplace
          </TabsTrigger>
          <TabsTrigger
            value="2fa"
            className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#e91e63] data-[state=active]:text-white data-[state=active]:bg-transparent rounded-none"
          >
            2FA Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileTab />
        </TabsContent>

        <TabsContent value="wallets" className="mt-6">
          <WalletsTab />
        </TabsContent>

        <TabsContent value="marketplace" className="mt-6">
          <MarketplaceTab />
        </TabsContent>

        <TabsContent value="2fa" className="mt-6">
          <SecurityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
