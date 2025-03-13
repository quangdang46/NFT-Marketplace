"use client";

import ProfileForm from "@/features/account/tabs/profile-tab/profile-form";
import SocialConnections from "@/features/account/tabs/profile-tab/social-connections";
import UserIdDisplay from "@/features/account/tabs/profile-tab/user-id-display";

export function ProfileTab() {
  return (
    <div className="mt-6 space-y-8">
      <ProfileForm />
      <SocialConnections />
      <UserIdDisplay id="f214a2a3-8...f07" />
    </div>
  );
}
