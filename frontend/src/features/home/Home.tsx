"use client";

import CarouselNFT from "@/features/shared/CarouselNFT/CarouselNFT";
import NFTCarouselv2 from "@/features/shared/nftchains/nft-carousel";
import NFTCollections from "@/features/shared/NFTCollections/NFTCollections";

export default function Home() {
  return (
    <>
      <CarouselNFT></CarouselNFT>
      <NFTCollections></NFTCollections>
      <NFTCarouselv2></NFTCarouselv2>
    </>
  );
}
