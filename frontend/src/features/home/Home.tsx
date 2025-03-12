"use client";
import { Blockchain, useNftStore } from "@/store/useNftStore";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { chain } = useParams();
  const setChain = useNftStore((state) => state.setSelectedBlockchain);
  useEffect(() => {
    const newChain = typeof chain === "string" ? chain.toUpperCase() : "ALL";
    setChain(newChain as Blockchain | "ALL");
  }, [chain, setChain]);
  return (
    <>
      home
      {chain}
      {/* <div className="mt-5">
        <NFTCarousel />
      </div>
      <div className="mt-5">
        <NFTCollections />
      </div>
      <div className="mt-5">
        <Suspense fallback={<NFTDetailsSkeleton />}>
          <NFTDetails />
        </Suspense>
      </div>
      <div className="mt-5">
        <CaroselV2 />
      </div>
      <div className="mt-5">
        <NFTCreationForm />
      </div>

      <div className="mt-5">
        <Marketplace />
      </div> */}
    </>
  );
}
