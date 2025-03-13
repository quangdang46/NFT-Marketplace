"use client";

import WalletList from "@/features/account/tabs/wallets-tab/wallet-list";
import WalletWarning from "@/features/account/tabs/wallets-tab/wallet-warning";

const wallets = [
  {
    id: "1",
    type: "Solana",
    address: "AzriPSB...Hjq",
    isPublic: false,
    earningStatus: "Stake to Start Earning",
    isActive: false,
  },
  {
    id: "2",
    type: "EVM",
    address: "0x35FE6...7e8",
    isPublic: false,
    earningStatus: "Link to earn",
    isActive: true,
  },
];

export function WalletsTab() {
  return (
    <div className="space-y-6">
      <WalletWarning />
      <WalletList wallets={wallets} />
    </div>
  );
}
