import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { wallets } from "@/lib/blockchain/walletConfig";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const {
    walletState,
    connectWallet,
    address,
    isConnecting,
    isSigning,
    isAuthenticated,
  } = useWallet();
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
                    className="w-full flex items-center justify-between py-3 bg-[#1A1A1A] border-[#2A2A2A] hover:bg-[#222222] text-white"
                    onClick={() => handleConnect(wallet.id)}
                    disabled={isConnecting}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">{wallet.logo}</span>
                      {wallet.name}
                    </span>
                    {isConnecting && selectedWalletId === wallet.id && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center"
            style={{ minHeight: "280px" }}
          >
            <div className="mb-6">
              <div
                className="w-20 h-20 flex items-center justify-center text-4xl rounded-xl overflow-hidden relative"
                style={{ backgroundColor: selectedWallet?.color || "#000" }}
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
                  Connecting...
                </h3>
                <p className="text-gray-400 text-center">
                  Approve the connection in your wallet
                </p>
              </>
            )}
            {walletState === "signing" && (
              <>
                <h3 className="text-xl font-bold text-white mb-2">
                  Sign Message
                </h3>
                <p className="text-gray-400 text-center">
                  Sign the message to verify ownership
                </p>
              </>
            )}
            {walletState === "authenticated" && (
              <>
                <h3 className="text-xl font-bold text-white mb-2">
                  Connected!
                </h3>
                <p className="text-gray-400 text-center">
                  Wallet {address?.slice(0, 6)}... verified
                </p>
              </>
            )}
            {walletState === "failed" && (
              <>
                <h3 className="text-xl font-bold text-white mb-2">
                  Connection Failed
                </h3>
                <p className="text-gray-400 text-center mb-4">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2 inline" />
                  Failed to connect or verify
                </p>
                <Button
                  variant="outline"
                  onClick={() => handleConnect(selectedWalletId || "metaMask")}
                  className="text-white"
                >
                  Retry
                </Button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
