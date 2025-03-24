import CreateCollection from "@/features/create/CreateCollection/CreateCollection";

export const metadata = {
  title: "Create Collection | NFT Marketplace",
  description: "Create a new NFT collection on the marketplace",
};

export default function CreateCollectionPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Collection</h1>
      <CreateCollection></CreateCollection>
    </div>
  );
}
