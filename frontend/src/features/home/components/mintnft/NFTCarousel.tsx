"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface NFTCarouselProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export default function NFTCarousel({
  images,
  initialIndex,
  onClose,
}: NFTCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent scrolling when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [currentIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/10"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      <div className="relative w-full h-full flex items-center justify-center">
        {/* Previous button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 z-10 rounded-full bg-black/50 hover:bg-black/70 text-white"
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* Image */}
        <div className="relative w-full max-w-4xl aspect-square md:aspect-auto md:h-[80vh]">
          <Image
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`NFT image ${currentIndex + 1}`}
            fill
            className="object-contain"
          />
        </div>

        {/* Next button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 z-10 rounded-full bg-black/50 hover:bg-black/70 text-white"
          onClick={handleNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Thumbnails */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-white/30"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
