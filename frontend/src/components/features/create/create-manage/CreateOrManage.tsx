import NftDropContent from "./components/nft-drop-content";
import NftDropHeader from "./components/nft-drop-header";
import React from "react";
export default function CreateOrManage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <NftDropHeader />
      <NftDropContent />
    </div>
  );
}
