"use client";
import { useParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { NFTCollections } from "@/features/home/components/NftCollections/NftCollections";
import { Blockchain, useNftStore } from "@/store/useNftStore";
import { NFTCarousel } from "@/features/home/components/nftchains/nft-carousel";
import NFTCollectionsv2 from "@/features/home/components/NftCollections/NFTCollectionsv2";
import NFTDetails from "@/features/home/components/mintnft/NFTDetails";
import NFTDetailsSkeleton from "@/features/home/components/mintnft/NFTDetailsSkeleton";
import NFTCreationForm from "@/features/home/components/createnft/CreateNft";

export default function Home() {
  const { chain } = useParams(); // chain là string hoặc undefined

  const setChain = useNftStore((state) => state.setSelectedBlockchain); // Lấy setChain từ store
  useEffect(() => {
    const newChain = typeof chain === "string" ? chain.toUpperCase() : "ALL";
    setChain(newChain as Blockchain | "ALL");
  }, [chain, setChain]);
  return (
    <>
      {chain}
      <NFTCollections />
      <div className="mt-5">
        <NFTCarousel />
      </div>
      <div className="mt-5">
        <NFTCollectionsv2 />
      </div>
      <div className="mt-5">
        <Suspense fallback={<NFTDetailsSkeleton />}>
          <NFTDetails />
        </Suspense>
      </div>
      <div className="mt-5">
        <NFTCreationForm />
      </div>
    </>
  );
}
