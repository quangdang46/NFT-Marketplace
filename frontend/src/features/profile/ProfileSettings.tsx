"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { toast } from "sonner";
import ConnectedDevices from "@/features/profile/account/tabs/security-tab/connected-devices";
import TwoFactorAuth from "@/features/profile/account/tabs/security-tab/two-factor-auth";
import { ProfileTab } from "@/features/profile/account/tabs/profile-tab";

export function ProfileSettings() {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);

      toast.success("Settings saved", {
        description: "Your profile settings have been updated successfully",
      });
    }, 1000);
  };

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid grid-cols-4 w-full max-w-xl mb-8">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="wallet">Wallet</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your profile information visible to other users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6"><ProfileTab></ProfileTab></CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="wallet">
        <Card>
          <CardHeader>
            <CardTitle>Wallet Settings</CardTitle>
            <CardDescription>
              Manage your connected wallets and payment preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Connected Wallets</h3>

              <div className="bg-muted/50 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Image
                      src="https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20"
                      alt="Metamask"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div>
                    <p className="font-medium">Metamask</p>
                    <p className="text-sm text-muted-foreground">
                      0x1234...5678
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Disconnect
                  </Button>
                  <Button size="sm">Primary</Button>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Connect Another Wallet
              </Button>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">Transaction Settings</h3>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Gas Price Preference</p>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred gas price setting
                  </p>
                </div>
                <Select defaultValue="standard">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Gas Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Slow (Cheaper)</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="fast">Fast (More Expensive)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="slippage" defaultChecked />
                <Label htmlFor="slippage">
                  Enable custom slippage tolerance
                </Label>
              </div>
            </div>

            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Manage how and when you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Email Notifications</h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-bids" className="flex-1">
                    Bids on your NFTs
                  </Label>
                  <Switch id="email-bids" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="email-purchases" className="flex-1">
                    Successful purchases
                  </Label>
                  <Switch id="email-purchases" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="email-sales" className="flex-1">
                    Successful sales
                  </Label>
                  <Switch id="email-sales" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="email-price" className="flex-1">
                    Price changes
                  </Label>
                  <Switch id="email-price" />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="email-newsletter" className="flex-1">
                    Newsletter and updates
                  </Label>
                  <Switch id="email-newsletter" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">Push Notifications</h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-bids" className="flex-1">
                    Bids on your NFTs
                  </Label>
                  <Switch id="push-bids" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="push-purchases" className="flex-1">
                    Successful purchases
                  </Label>
                  <Switch id="push-purchases" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="push-sales" className="flex-1">
                    Successful sales
                  </Label>
                  <Switch id="push-sales" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="push-followers" className="flex-1">
                    New followers
                  </Label>
                  <Switch id="push-followers" />
                </div>
              </div>
            </div>

            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Manage your account security and privacy preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <TwoFactorAuth></TwoFactorAuth>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">Privacy Settings</h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-balance" className="flex-1">
                    Show my wallet balance publicly
                  </Label>
                  <Switch id="show-balance" />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-activity" className="flex-1">
                    Show my activity publicly
                  </Label>
                  <Switch id="show-activity" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="allow-offers" className="flex-1">
                    Allow offers on my NFTs
                  </Label>
                  <Switch id="allow-offers" defaultChecked />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">Account Recovery</h3>

              <div className="space-y-2">
                <Label htmlFor="recovery-email">Recovery Email</Label>
                <Input
                  id="recovery-email"
                  type="email"
                  defaultValue="your.email@example.com"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <ConnectedDevices></ConnectedDevices>
            </div>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
