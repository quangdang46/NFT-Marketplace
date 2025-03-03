import { client } from "@/lib/blockchain/thirdweb";
import React from "react";
import { ConnectButton } from "thirdweb/react";

import { inAppWallet, createWallet } from "thirdweb/wallets";

const wallets = [
  inAppWallet({
    auth: {
      options: ["google", "email", "x"],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("com.okex.wallet"),
  createWallet("com.bitget.web3"),
];
export default function ConnectWallet() {
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      theme={"dark"}
      connectModal={{ size: "wide" }}
    />
  );
}
