import ExistingCollections from "./existing-collections";
import NewCollection from "./new-collection";

export default function NftDropContent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <NewCollection />
      <ExistingCollections />
    </div>
  );
}
