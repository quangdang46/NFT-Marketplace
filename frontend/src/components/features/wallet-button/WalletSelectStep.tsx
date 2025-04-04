import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { wallets } from "@/lib/blockchain/walletConfig";

interface WalletSelectStepProps {
  wallets: typeof wallets;
  onConnect: (walletId: string) => void;
  isConnectPending: boolean;
  isAuthenticating: boolean;
  selectedWallet: string | null;
}

export function WalletSelectStep({
  wallets,
  onConnect,
  isConnectPending,
  isAuthenticating,
  selectedWallet,
}: WalletSelectStepProps) {
  return (
    <div className="p-5 pt-0">
      <ul className="space-y-2">
        {wallets.map((wallet) => (
          <li key={wallet.id}>
            <Button
              variant="outline"
              className="w-full flex items-center justify-between text-left h-auto py-3 px-4 bg-[#1A1A1A] border-[#2A2A2A] hover:bg-[#222222]"
              onClick={() => onConnect(wallet.id)}
              disabled={
                isConnectPending ||
                isAuthenticating ||
                selectedWallet === wallet.id
              }
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{wallet.logo}</span>
                <div>
                  <p className="text-white font-medium">{wallet.name}</p>
                  <p className="text-gray-500 text-xs">{wallet.status}</p>
                </div>
              </div>
              {(isConnectPending || isAuthenticating) &&
                selectedWallet === wallet.id && (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                )}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
