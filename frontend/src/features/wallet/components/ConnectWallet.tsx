/* eslint-disable @next/next/no-img-element */
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet } from "lucide-react";
import React from "react";
export default function ConnectWallet() {
  return (
    <>
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== "loading";
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === "authenticated");

          return (
            <div
              {...(!ready && {
                "aria-hidden": true,
                style: {
                  opacity: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                },
              })}
              className="flex items-center"
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className="cursor-pointer px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors text-sm md:text-base"
                    >
                      <span className="hidden sm:inline">Connect Wallet</span>
                      <Wallet className="inline sm:hidden" />
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm md:text-base"
                    >
                      Wrong network
                    </button>
                  );
                }

                return (
                  <div className="flex items-center gap-2 md:gap-3">
                    {/* Chain Button */}
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="flex items-center text-sm md:text-base hover:opacity-80 transition-opacity"
                    >
                      {chain.hasIcon && (
                        <div
                          className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden mr-1 md:mr-2"
                          style={{ background: chain.iconBackground }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      )}
                      <span className="hidden sm:inline">{chain.name}</span>
                    </button>

                    {/* Account Button */}
                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="text-sm md:text-base hover:opacity-80 transition-opacity truncate max-w-[120px] md:max-w-[200px]"
                    >
                      {/* Rút gọn địa chỉ ví */}
                      {account.displayName.length > 10
                        ? `${account.displayName.slice(
                            0,
                            6
                          )}...${account.displayName.slice(-4)}`
                        : account.displayName}
                      {/* Số dư chỉ hiển thị từ md trở lên */}
                      {account.displayBalance && (
                        <span className="hidden md:inline">
                          {` (${account.displayBalance})`}
                        </span>
                      )}
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </>
  );
}
