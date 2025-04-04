import { Loader2, Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { shortenAddress } from "@/lib/utils/shortenAddress";
import { wallets } from "@/lib/blockchain/walletConfig";

interface WalletStatusStepProps {
  modalStep: "connecting" | "signing" | "success" | "failed";
  selectedWalletData: (typeof wallets)[number] | undefined;
  address: string | undefined;
  onManualSignature: () => void;
  onBack: () => void;
  signatureRetryCount: number;
}

export function WalletStatusStep({
  modalStep,
  selectedWalletData,
  address,
  onManualSignature,
  onBack,
  signatureRetryCount,
}: WalletStatusStepProps) {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center px-5 pb-5"
      style={{ minHeight: "280px" }}
    >
      <div className="mb-6">
        <div
          className="w-20 h-20 flex items-center justify-center text-4xl rounded-xl overflow-hidden relative"
          style={{ backgroundColor: selectedWalletData?.color }}
        >
          {selectedWalletData?.logo}
          {(modalStep === "connecting" || modalStep === "signing") && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
          {modalStep === "success" && (
            <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
          )}
        </div>
      </div>
      {modalStep === "connecting" && (
        <>
          <h3 className="text-xl font-bold text-white mb-2">
            Connecting Wallet
          </h3>
          <p className="text-gray-400 text-center mb-4">
            Check your wallet to approve the connection
          </p>
        </>
      )}
      {modalStep === "signing" && (
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
          {signatureRetryCount > 0 && (
            <Button
              variant="ghost"
              onClick={onManualSignature}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Retry Signing
            </Button>
          )}
        </>
      )}
      {modalStep === "success" && (
        <>
          <h3 className="text-xl font-bold text-white mb-2">Connected!</h3>
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
      {modalStep === "failed" && (
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
              onClick={onManualSignature}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Retry Signing
            </Button>
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Try Another Wallet
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
