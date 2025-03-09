"use client";
import TabChains from "./TabChains/TabChains";
import { useParams } from "next/navigation";

export default function Home() {
  const { chain } = useParams(); // chain là string hoặc undefined
  return (
    <>
      <TabChains activeChain={chain as string} />
      <div>{chain ? `Current chain: ${chain}` : "No chain selected"}</div>
    </>
  );
}
