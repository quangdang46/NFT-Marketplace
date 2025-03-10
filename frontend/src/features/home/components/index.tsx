"use client";
import TabChains from "./TabChains/TabChains";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { NFTCollections } from "@/features/home/components/NftCollections/NftCollections";
import { useNftStore } from "@/store/useNftStore";

export default function Home() {
  const { chain } = useParams(); // chain là string hoặc undefined

  const setChain = useNftStore((state) => state.setSelectedBlockchain); // Lấy setChain từ store
  useEffect(() => {
    const newChain = typeof chain === "string" ? chain : "all";
    setChain(newChain);
  }, [chain, setChain]);
  return (
    <>
      <TabChains />
      <NFTCollections />
    </>
  );
}
