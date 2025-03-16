import NFTDetails from "@/features/shared/CollectionDetail/nft-details";
import React from "react";
export const metadata = {
  title: "Launchpad",
  description: "Launchpad",
};

export default async function page(props: {
  params?: Promise<{
    chain: string;
    address: string;
  }>;
}) {
  console.log("params", await props.params);
  return <NFTDetails></NFTDetails>;
}
