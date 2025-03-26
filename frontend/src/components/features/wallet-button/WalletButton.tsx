import { WalletDropdown } from "./WalletDropdown";
import { useRef, useState, useEffect } from "react";
import ConnectWallet from "@/components/features/wallet-button/ConnectWallet";
import { useAccount, useBalance } from "wagmi";

export const WalletButton = () => {
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
  const walletRef = useRef<HTMLDivElement>(null);
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        walletRef.current &&
        !walletRef.current.contains(event.target as Node)
      ) {
        setIsWalletDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="relative inline-block"
      ref={walletRef}
      onMouseEnter={() => isConnected && setIsWalletDropdownOpen(true)}
      onMouseLeave={() => isConnected && setIsWalletDropdownOpen(false)}
    >
      <ConnectWallet />
      {isConnected && (
        <WalletDropdown
          isOpen={isWalletDropdownOpen}
          walletBalance={`${balance?.formatted || "0"} ${
            balance?.symbol || "ETH"
          }`}
          address={address || ""}
          className="absolute top-full right-0 mt-0 z-10" // Di chuyển className vào WalletDropdown
        />
      )}
    </div>
  );
};
