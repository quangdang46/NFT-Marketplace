"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Expand } from "lucide-react"

interface NFTImageGalleryProps {
  images: string[]
  title: string
  onOpenCarousel: (index: number) => void
}

export default function NFTImageGallery({ images, title, onOpenCarousel }: NFTImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const hasThumbnails = images.length > 1

  return (
    <div className="bg-gradient-to-b from-purple-900/50 to-purple-950 dark:from-purple-800/30 dark:to-purple-900/50 rounded-lg p-4 relative">
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/30 dark:bg-white/10 backdrop-blur-sm hover:bg-black/50 dark:hover:bg-white/20 text-white rounded-md"
          onClick={() => onOpenCarousel(currentImageIndex)}
        >
          <Expand className="h-5 w-5" />
        </Button>
      </div>
      <div className="aspect-square relative rounded-md overflow-hidden">
        <Image
          src={images[currentImageIndex] || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Only show thumbnails if there's more than one image */}
      {hasThumbnails && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <div
              key={index}
              className={`flex-shrink-0 w-24 h-24 relative rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200 hover:opacity-90 dark:hover:opacity-80 ${
                index === currentImageIndex ? "border-purple-500 dark:border-purple-400" : "border-transparent"
              }`}
              onClick={() => setCurrentImageIndex(index)}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

