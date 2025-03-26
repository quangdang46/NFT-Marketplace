import { AuctionsList } from "@/components/features/auctions/AuctionsList";

export const metadata = {
  title: "Live Auctions | NFT Marketplace",
  description: "Participate in live NFT auctions across multiple blockchains",
};

export default function AuctionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Live Auctions</h1>
      <AuctionsList />
    </div>
  );
}
