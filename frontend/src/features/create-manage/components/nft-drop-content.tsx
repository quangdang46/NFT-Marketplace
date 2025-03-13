import ExistingCollections from "@/features/create-manage/components/existing-collections";
import NewCollection from "@/features/create-manage/components/new-collection";

export default function NftDropContent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <NewCollection />
      <ExistingCollections />
    </div>
  );
}
