import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NftDropHeader() {
  return (
    <header className="mb-8">
      <Link
        href="/create/nft"
        className="inline-flex items-center text-white hover:text-gray-300 transition-colors"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        <span className="text-lg font-medium">Create NFT Drop</span>
      </Link>
    </header>
  );
}
