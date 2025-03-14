import { Button } from "@/components/ui/button";

export function HeaderCarousel() {
  return (
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-2xl font-bold tracking-tight">NFT Drops Calendar</h2>
      <Button variant="outline" size="sm">
        See all
      </Button>
    </div>
  );
}
