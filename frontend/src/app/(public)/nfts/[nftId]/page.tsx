import { NFTDetail } from "@/components/features/nfts/NFTDetail";
import { NFTGrid } from "@/components/features/nfts/NFTGrid";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface NFTDetailPageProps {
  params: {
    nftId: string;
  };
}

export function generateMetadata({ params }: NFTDetailPageProps) {
  // Validate nftId format
  if (!params.nftId || !params.nftId.match(/^nft-\d+$/)) {
    return {
      title: "NFT Not Found | NFT Marketplace",
      description: "The requested NFT was not found",
    };
  }

  return {
    title: `NFT ${params.nftId} | NFT Marketplace`,
    description: `View details of NFT ${params.nftId}`,
  };
}

export default function NFTDetailPage({ params }: NFTDetailPageProps) {
  // Validate nftId format
  if (!params.nftId || !params.nftId.match(/^nft-\d+$/)) {
    notFound();
  }

  return (
    <Suspense>
      <NFTDetail nftId={params?.nftId || "1"} />
      <p>NFTs from the same collection</p>
      <NFTGrid collectionId="1" chainId="1"></NFTGrid>
    </Suspense>
  );
}
