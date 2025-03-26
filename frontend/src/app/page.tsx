import { Suspense } from "react";
import { HomeContent } from "../components/features/home/HomeContent";
import { ChainTabs } from "../components/features/home/ChainTabs";

export const metadata = {
  title: "NFT Marketplace | Explore Collections Across Multiple Chains",
  description:
    "Discover, collect, and sell extraordinary NFTs across multiple blockchains",
};

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Wrap ChainTabs in a Suspense boundary */}
      <Suspense
        fallback={
          <div className="h-12 bg-muted animate-pulse rounded-lg"></div>
        }
      >
        <ChainTabs />
      </Suspense>
      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <HomeContent />
      </Suspense>
    </div>
  );
}
