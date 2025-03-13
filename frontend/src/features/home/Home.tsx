"use client";

import { useParams } from "next/navigation";

export default function Home() {
  const params = useParams();
  const chain = params.chain;
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
