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

  const tab = searchParams.get("tab") || "profile";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (!searchParams.has("tab")) {
      router.replace(`${pathname}?tab=profile`, { scroll: false });
    }
  }, [tab, pathname, router, searchParams]);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      <Tabs value={tab} onValueChange={handleTabChange} className="mb-8">
        <TabsList className="bg-transparent border-b border-[#2a2a3a] w-full justify-start rounded-none p-0 h-auto">
          {["profile", "wallets", "marketplace", "security"].map((t) => (
            <TabsTrigger
              key={t}
              value={t}
              className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#e91e63] data-[state=active]:text-white data-[state=active]:bg-transparent rounded-none"
            >
              {t === "profile"
                ? "Profile"
                : t === "wallets"
                ? "Wallets"
                : t === "marketplace"
                ? "Marketplace"
                : "2FA Settings"}
            </TabsTrigger>
          ))}
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
