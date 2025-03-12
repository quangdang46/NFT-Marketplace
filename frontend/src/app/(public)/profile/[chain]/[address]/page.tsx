import Account from "@/features/account/Account";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Profile",
  description: "Profile",
};
export default async function page({
  params,
}: {
  params: { chain: string; address: string };
}) {
  const { chain, address } = await params;
  return (
    <div>
      <h1>Profile {address}</h1>
      <h1>Chain {chain}</h1>
      <Account />
    </div>
  );
}
