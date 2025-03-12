"use client";

export default function Home() {
  // const { chain } = useParams(); // chain là string hoặc undefined

  // const setChain = useNftStore((state) => state.setSelectedBlockchain); // Lấy setChain từ store
  // useEffect(() => {
  //   const newChain = typeof chain === "string" ? chain.toUpperCase() : "ALL";
  //   setChain(newChain as Blockchain | "ALL");
  // }, [chain, setChain]);
  return (
    <>
      home
      {/* {chain} */}
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
