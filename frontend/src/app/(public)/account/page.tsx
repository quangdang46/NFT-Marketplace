import Account from "@/features/account/Account";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Account",
  description: "Account",
};

export default function page() {
  return <Account />;
}
