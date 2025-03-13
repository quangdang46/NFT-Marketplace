import TwoFactorAuth from "@/features/account/tabs/security-tab/two-factor-auth";
import PasswordChange from "@/features/account/tabs/security-tab/password-change";
import ConnectedDevices from "@/features/account/tabs/security-tab/connected-devices";

export function SecurityTab() {
  return (
    <div className="space-y-8">
      <TwoFactorAuth />
      <PasswordChange />
      <ConnectedDevices />
    </div>
  );
}
