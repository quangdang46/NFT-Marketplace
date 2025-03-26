import { CollectionsList } from "@/components/features/collections/CollectionsList";
import { ChainFilter } from "@/components/features/shared/ChainFilter";

export const metadata = {
  title: "All Collections | NFT Marketplace",
  description: "Browse all NFT collections across multiple blockchains",
};

export default function CollectionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">All Collections</h1>
      <ChainFilter baseUrl="/collections/chain" />
      <CollectionsList />
    </div>
  );
}
