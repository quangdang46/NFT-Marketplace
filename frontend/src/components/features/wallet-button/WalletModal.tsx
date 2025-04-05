import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { wallets } from "@/lib/blockchain/walletConfig";
import { shortenAddress } from "@/lib/utils/shortenAddress";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { walletState, connectWallet, address, isConnecting, isAuthenticated } =
    useWallet();
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);

  useEffect(() => {
    console.log("WalletModal: State change", {
      walletState,
      isAuthenticated,
      isOpen,
    });
    if (isAuthenticated && isOpen) {
      setTimeout(() => {
        onClose();
        setSelectedWalletId(null);
      }, 1000);
    }
  }, [isAuthenticated, isOpen, onClose, walletState]);

  const handleConnect = (walletId: string) => {
    setSelectedWalletId(walletId);
    connectWallet(walletId);
  };

  const selectedWallet = wallets.find((w) => w.id === selectedWalletId);

  console.log("WalletModal render", { isOpen, walletState });
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogTitle className="hidden">Connect Wallet</DialogTitle>
      <DialogContent className="max-w-[360px] p-5 bg-[#111111] rounded-xl">
        <DialogDescription className="hidden">
          Modal to connect and authenticate your blockchain wallet.
        </DialogDescription>
        {walletState === "disconnected" ? (
          <div>
            <h2 className="text-lg font-bold text-white mb-4">
              Connect Wallet
            </h2>
            <ul className="space-y-2">
              {wallets.map((wallet) => (
                <li key={wallet.id}>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-between text-left h-auto py-3 px-4 bg-[#1A1A1A] border-[#2A2A2A] hover:bg-[#222222]"
                    onClick={() => handleConnect(wallet.id)}
                    disabled={isConnecting}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{wallet.logo}</span>
                      <div>
                        <p className="text-white font-medium">{wallet.name}</p>
                        <p className="text-gray-500 text-xs">{wallet.status}</p>
                      </div>
                    </div>
                    {(isConnecting || isAuthenticated) &&
                      selectedWalletId === wallet.id && (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      )}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div
            className="flex-1 flex flex-col items-center justify-center px-5 pb-5"
            style={{ minHeight: "280px" }}
          >
            <div className="mb-6">
              <div
                className="w-20 h-20 flex items-center justify-center text-4xl rounded-xl overflow-hidden relative"
                style={{ backgroundColor: selectedWallet?.color }}
              >
                {selectedWallet?.logo}
                {(walletState === "connecting" ||
                  walletState === "signing") && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                )}
                {walletState === "authenticated" && (
                  <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>
            </div>

            {walletState === "connecting" && (
              <>
                <h3 className="text-xl font-bold text-white mb-2">
                  Connecting Wallet
                </h3>
                <p className="text-gray-400 text-center mb-4">
                  Check your wallet to approve the connection
                </p>
              </>
            )}
            {walletState === "signing" && (
              <>
                <h3 className="text-xl font-bold text-white mb-2">
                  Waiting for Signature
                </h3>
                <p className="text-gray-400 text-center mb-4">
                  Please sign the message in your wallet to verify ownership
                </p>
                <p className="text-amber-400 text-xs text-center mb-2">
                  Signature is required to connect
                </p>
              </>
            )}
            {walletState === "authenticated" && (
              <>
                <h3 className="text-xl font-bold text-white mb-2">
                  Connected!
                </h3>
                <p className="text-gray-400 text-center mb-4">
                  <span className="flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-400 mr-2" />
                    Wallet verified successfully
                  </span>
                </p>
                <p className="text-gray-400 text-sm">
                  Wallet {shortenAddress(address || "")} successfully connected
                </p>
              </>
            )}
            {walletState === "failed" && (
              <>
                <h3 className="text-xl font-bold text-white mb-2">
                  Connection Failed
                </h3>
                <p className="text-gray-400 text-center mb-8">
                  <span className="flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                    <span>Failed to verify wallet ownership</span>
                  </span>
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={() =>
                      handleConnect(selectedWalletId || "metaMask")
                    }
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Retry
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
