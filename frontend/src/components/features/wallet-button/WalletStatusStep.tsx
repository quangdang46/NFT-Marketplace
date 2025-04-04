import { AlertCircle, Loader2, RefreshCw, Shield } from "lucide-react";
import { memo } from "react";

interface WalletStatusStepProps {
  modalStep: "connecting" | "signing" | "success" | "failed";
  selectedWalletData?: { name: string; color: string; logo: string };
  address?: string;
  onManualSignature: () => void;
  onBack: () => void;
  signatureRetryCount: number;
  connectError?: Error;
  authError?: string;
}

function WalletStatusStepContent({
  modalStep,
  selectedWalletData,
  address,
  onManualSignature,
  onBack,
  signatureRetryCount,
  connectError,
  authError,
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
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
          </div>
          <p className="text-gray-400 text-center mb-4">
            Please sign the message in your wallet to verify ownership
          </p>
          <p className="text-amber-400 text-xs text-center mb-2">
            Signature is required to connect
          </p>
          <button
            onClick={onManualSignature}
            className="text-blue-400 hover:text-blue-300 text-xs mt-2 mb-4 px-3 py-1.5 border border-blue-800/30 rounded-lg transition-colors flex items-center"
          >
            <RefreshCw className="h-3 w-3 mr-1.5" />
            {signatureRetryCount > 0
              ? "Retry Signature Request"
              : "Open Signature Popup"}
          </button>
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
          {address && (
            <p className="text-gray-400 text-xs text-center mb-2">
              {`${address.slice(0, 6)}...${address.slice(-4)}`}
            </p>
          )}
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
              {authError ||
                connectError?.message ||
                "Failed to verify wallet ownership"}
            </span>
          </p>
          <button
            onClick={onBack}
            className="text-blue-400 hover:text-blue-300 text-sm mt-2 px-4 py-2 border border-blue-800/30 rounded-lg transition-colors"
          >
            Try again
          </button>
        </>
      )}
    </div>
  );
}

export const WalletStatusStep = memo(WalletStatusStepContent);
