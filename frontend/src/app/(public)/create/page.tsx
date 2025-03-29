import CreateOrManage from "@/components/features/create/create-manage";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "NFT Marketplace | Create or Manage NFT Drops",
  description: "Create or manage your NFT drops",
};

export default function page() {
  return <CreateOrManage></CreateOrManage>;
}
