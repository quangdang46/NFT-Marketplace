import { useWallet } from "@/hooks/useWallet";
import { ConnectButton } from "./ConnectButton";
import { WalletInfo } from "./WalletInfo";

export function WalletSection() {
  const { isConnected, isAuthenticated } = useWallet();

  return (
    <>{!isConnected || !isAuthenticated ? <ConnectButton /> : <WalletInfo />}</>
  );
}
