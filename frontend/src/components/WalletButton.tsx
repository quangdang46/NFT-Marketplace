import { WalletDropdown } from "./WalletDropdown";
import { useRef, useState, useEffect } from "react";
import ConnectWallet from "@/features/wallet/components/ConnectWallet";
import { useAccount, useBalance } from "wagmi";

export const WalletButton = () => {
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
  const walletRef = useRef<HTMLDivElement>(null);
  const { address, isConnected } = useAccount(); // Trạng thái kết nối ví
  const { data: balance } = useBalance({ address }); // Số dư ví

  // Xử lý click ngoài để đóng dropdown
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
      className="relative"
      ref={walletRef}
      onMouseEnter={() => isConnected && setIsWalletDropdownOpen(true)}
      onMouseLeave={() => isConnected && setIsWalletDropdownOpen(false)}
    >
      <ConnectWallet></ConnectWallet>

      {isConnected && (
        <WalletDropdown
          isOpen={isWalletDropdownOpen}
          walletBalance={`${balance || "0"} ${balance?.symbol || "ETH"}`}
          disconnectWallet={() => setIsWalletDropdownOpen(false)} // Có thể bỏ nếu không cần
        />
      )}
    </div>
  );
};
