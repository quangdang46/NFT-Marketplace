import NftDropContent from "@/features/create-manage/components/nft-drop-content";
import NftDropHeader from "@/features/create-manage/components/nft-drop-header";
import React from "react";
export default function CreateOrManage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <NftDropHeader />
      <NftDropContent />
    </div>
  );
}
