import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { mockChains } from "@/data/mockData";
import { ChainFilter } from "@/components/features/shared/ChainFilter";
import { CollectionsList } from "@/components/features/collections/CollectionsList";

interface ChainCollectionsPageProps {
  params: {
    chainId: string;
  };
}

export function generateMetadata({ params }: ChainCollectionsPageProps) {
  // Validate chainId
  const validChain = mockChains.find((chain) => chain.id === params.chainId);
  if (!validChain) {
    return {
      title: "Chain Not Found | NFT Marketplace",
      description: "The requested blockchain was not found",
    };
  }

  // Capitalize first letter of chainId
  const chainName = validChain.name;

  return {
    title: `${chainName} Collections | NFT Marketplace`,
    description: `Browse NFT collections on the ${chainName} blockchain`,
  };
}

export default function ChainCollectionsPage({
  params,
}: ChainCollectionsPageProps) {
  // Validate chainId
  const validChain = mockChains.find((chain) => chain.id === params.chainId);
  if (!validChain) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/collections">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Collections on {validChain.name}</h1>
      </div>

      <ChainFilter baseUrl="/collections/chain" />
      <CollectionsList chainId={params.chainId} />
    </div>
  );
}
