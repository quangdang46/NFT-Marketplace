import { Wallet, ExternalLink, Link2, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WalletDropdownProps {
  isOpen: boolean;
  walletBalance: string;
  disconnectWallet: () => void;
}

export const WalletDropdown = ({
  isOpen,
  walletBalance,
  disconnectWallet,
}: WalletDropdownProps) => {
  return (
    <div
      className={cn(
        "absolute top-full right-0 mt-2 w-80 bg-[#1A1F2C]/95 border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden transition-all duration-300 dropdown-slide-down",
        isOpen
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2 pointer-events-none"
      )}
    >
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-[#f97316]/30 rounded-full flex items-center justify-center">
              <Wallet className="h-4 w-4 text-[#f97316]" />
            </div>
            <div>
              <div className="text-sm text-white/60">Wallet Address</div>
              <div className="text-white flex items-center">
                <span className="font-mono">0x35F...7e8</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-1 text-white/50 hover:text-white"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[#f97316] font-medium">
              {walletBalance}
            </div>
            <div className="text-xs text-white/50">≈ $2,437.84</div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-[#1A1F2C]/95 rounded-lg p-3 mb-4">
          <div className="text-white/60 text-sm mb-2">Main</div>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="ghost"
              className="bg-white/5 hover:bg-white/10 flex flex-col h-auto py-2"
            >
              <span className="text-xs text-white/60 mb-1">Buy</span>
              <span className="text-white">ETH</span>
            </Button>
            <Button
              variant="ghost"
              className="bg-white/5 hover:bg-white/10 flex flex-col h-auto py-2"
            >
              <span className="text-xs text-white/60 mb-1">Send</span>
              <span className="text-white">ETH</span>
            </Button>
            <Button
              variant="ghost"
              className="bg-white/5 hover:bg-white/10 flex flex-col h-auto py-2"
            >
              <span className="text-xs text-white/60 mb-1">Receive</span>
              <span className="text-white">ETH</span>
            </Button>
          </div>
        </div>

        <div className="space-y-1 mb-4">
          <div className="text-white/60 text-sm mb-2">Tokens</div>

          <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-indigo-500/20 rounded-full flex items-center justify-center mr-3">
                <span className="text-indigo-400 text-xs">ETH</span>
              </div>
              <div>
                <div className="text-white">Ethereum</div>
                <div className="text-xs text-white/50">ETH</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white">{walletBalance}</div>
              <div className="text-xs text-white/50">$2,437.84</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-400 text-xs">USDC</span>
              </div>
              <div>
                <div className="text-white">USDC</div>
                <div className="text-xs text-white/50">USDC</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white">0 USDC</div>
              <div className="text-xs text-white/50">$0.00</div>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-white/70 hover:text-white hover:bg-white/5"
          >
            <Link2 className="mr-2 h-4 w-4" />
            Link Wallet
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-white/70 hover:text-white hover:bg-white/5"
          >
            <Settings className="mr-2 h-4 w-4" />
            Account Settings
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-white/70 hover:text-white hover:bg-white/5"
            onClick={disconnectWallet}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </Button>
        </div>
      </div>
    </div>
  );
};
