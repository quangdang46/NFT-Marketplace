import { AuctionDetail } from "@/components/features/auctions/AuctionDetail";
import { notFound } from "next/navigation";

interface AuctionDetailPageProps {
  params: {
    auctionId: string;
  };
}

export function generateMetadata({ params }: AuctionDetailPageProps) {
  // Validate auctionId format
  if (!params.auctionId || !params.auctionId.match(/^auction-\d+$/)) {
    return {
      title: "Auction Not Found | NFT Marketplace",
      description: "The requested auction was not found",
    };
  }

  return {
    title: `Auction ${params.auctionId} | NFT Marketplace`,
    description: `Participate in the auction for NFT ${params.auctionId}`,
  };
}

export default function AuctionDetailPage({ params }: AuctionDetailPageProps) {
  // Validate auctionId format
  if (!params.auctionId || !params.auctionId.match(/^auction-\d+$/)) {
    notFound();
  }

  return (
    <div>
      <AuctionDetail auctionId={params.auctionId} />
    </div>
  );
}
