"use client";

import ProfileForm from "./profile-form";
import SocialConnections from "./social-connections";
import UserIdDisplay from "./user-id-display";

export function ProfileTab() {
  return (
    <div className="mt-6 space-y-8">
      <ProfileForm />
      <SocialConnections />
      <UserIdDisplay id="f214a2a3-8...f07" />
    </div>
  );
}
