import { Loader2 } from "lucide-react";
import { memo } from "react";

interface WalletSelectStepProps {
  wallets: {
    id: string;
    name: string;
    status: string;
    color: string;
    logo: string;
  }[];
  onConnect: (walletId: string) => void;
  isConnectPending: boolean;
  isAuthenticating: boolean;
  selectedWallet: string | null;
}

function WalletSelectStepContent({
  wallets,
  onConnect,
  isConnectPending,
  isAuthenticating,
  selectedWallet,
}: WalletSelectStepProps) {
  return (
    <div className="px-5 pb-3">
      {wallets.map((wallet) => (
        <button
          key={wallet.id}
          className="flex items-center w-full py-3 text-white hover:bg-white/5 rounded-lg transition-colors"
          onClick={() => onConnect(wallet.id)}
          disabled={isConnectPending || isAuthenticating}
        >
          <div
            className="w-10 h-10 mr-3 flex-shrink-0 rounded-md flex items-center justify-center text-xl"
            style={{ backgroundColor: wallet.color }}
          >
            {wallet.logo}
          </div>
          <div className="flex flex-col items-start">
            <span className="font-medium">{wallet.name}</span>
            <span className="text-xs text-gray-400">{wallet.status}</span>
          </div>
          {(isConnectPending || isAuthenticating) &&
            selectedWallet === wallet.id && (
              <Loader2 className="h-4 w-4 text-blue-400 animate-spin ml-auto" />
            )}
        </button>
      ))}
      <div className="border-t border-gray-800 mt-2">
        <div className="flex justify-between items-center px-0 py-3 text-sm">
          <span className="text-gray-400">New to wallets?</span>
          <a
            href="https://ethereum.org/wallets"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300"
          >
            Get started
          </a>
        </div>
        <div className="border-t border-gray-800 px-0 py-3 flex justify-center">
          <div className="text-xs text-gray-500 flex items-center">
            Powered by <span className="ml-1 font-semibold">thirdweb</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const WalletSelectStep = memo(WalletSelectStepContent);
