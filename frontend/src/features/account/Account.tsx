"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useEffect } from "react";
import { ProfileTab } from "@/features/account/tabs/profile-tab";
import { WalletsTab } from "@/features/account/tabs/wallets-tab";
import { MarketplaceTab } from "@/features/account/tabs/marketplace-tab";
import { SecurityTab } from "@/features/account/tabs/security-tab";

export default function Account() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get the tab from search params or default to "profile"
  const tab = searchParams.get("tab") || "profile";

  // Update the URL when tab changes
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  // Set default tab if none is specified
  useEffect(() => {
    if (!searchParams.has("tab")) {
      const params = new URLSearchParams(searchParams);
      params.set("tab", "profile");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      <Tabs value={tab} onValueChange={handleTabChange} className="mb-8">
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
            value="security"
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

        <TabsContent value="security" className="mt-6">
          <SecurityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
