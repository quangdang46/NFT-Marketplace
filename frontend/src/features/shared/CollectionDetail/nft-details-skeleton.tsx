import { Skeleton } from "@/components/ui/skeleton"

export default function NFTDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side - NFT Image Skeleton */}
        <div className="lg:w-1/2">
          <div className="bg-gradient-to-b from-purple-900/50 to-purple-950 dark:from-purple-800/30 dark:to-purple-900/50 rounded-lg p-4">
            <Skeleton className="aspect-square w-full rounded-md bg-gray-200 dark:bg-gray-800" />
            <div className="flex gap-2 mt-4">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="w-24 h-24 rounded-md flex-shrink-0 bg-gray-200 dark:bg-gray-800" />
              ))}
            </div>
          </div>
        </div>

        {/* Right side - NFT Details Skeleton */}
        <div className="lg:w-1/2">
          <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="h-6 w-12 rounded bg-gray-200 dark:bg-gray-800" />
              <Skeleton className="h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
            </div>

            {/* Mint Stages Skeleton */}
            <Skeleton className="h-6 w-32 mb-2 rounded bg-gray-200 dark:bg-gray-800" />
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="h-24 w-full mb-3 rounded-lg bg-gray-200 dark:bg-gray-800" />
            ))}

            {/* Minting Progress Skeleton */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-5 w-20 rounded bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-5 w-24 rounded bg-gray-200 dark:bg-gray-800" />
              </div>
              <Skeleton className="h-2 w-full mb-1 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="flex justify-end">
                <Skeleton className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>

            {/* Price Skeleton */}
            <Skeleton className="h-5 w-16 mb-1 rounded bg-gray-200 dark:bg-gray-800" />
            <Skeleton className="h-8 w-24 mb-1 rounded bg-gray-200 dark:bg-gray-800" />
            <Skeleton className="h-5 w-32 mb-6 rounded bg-gray-200 dark:bg-gray-800" />

            {/* Email Input Skeleton */}
            <Skeleton className="h-5 w-40 mb-2 rounded bg-gray-200 dark:bg-gray-800" />
            <Skeleton className="h-10 w-full mb-2 rounded bg-gray-200 dark:bg-gray-800" />
            <Skeleton className="h-4 w-full mb-6 rounded bg-gray-200 dark:bg-gray-800" />

            {/* Buttons Skeleton */}
            <Skeleton className="h-12 w-full mb-4 rounded bg-gray-200 dark:bg-gray-800" />
            <Skeleton className="h-12 w-full rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </div>
    </div>
  )
}

