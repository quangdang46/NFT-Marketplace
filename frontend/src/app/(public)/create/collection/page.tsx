import CreateCollection from "@/components/features/create/create-collection";

export const metadata = {
  title: "Create Collection | NFT Marketplace",
  description: "Create a new NFT collection on the marketplace",
};

export default function CreateCollectionPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <CreateCollection></CreateCollection>
    </div>
  );
}
