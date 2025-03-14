"use client"

import { useState } from "react"
import type { NFTData } from "@/types/nft"
import NFTImageGallery from "./nft/nft-image-gallery"
import NFTInfo from "./nft/nft-info"
import NFTCarousel from "./nft-carousel"

// Sample NFT data
const initialNFTData: NFTData = {
  title: "DOGAMI Gamma, Series Abstract",
  currentPrice: "FREE",
  ethPrice: "0.0000 ETH",
  totalMinted: 218,
  totalSupply: 3000,
  mintStages: [
    {
      name: "Free Mint",
      status: "ENDS IN",
      time: { days: "00", hours: "00", minutes: "23", seconds: "25" },
      details: "WHITELIST 78 + 2 PER WALLET + Free Mint",
      active: true,
    },
    {
      name: "Doglist",
      status: "STARTS IN",
      time: { days: "00", hours: "00", minutes: "28", seconds: "25" },
      details: "WHITELIST 3597 + 5 PER WALLET + Price: 0.01 ETH",
      active: false,
    },
    {
      name: "Eligible",
      status: "STARTS IN",
      time: { days: "00", hours: "02", minutes: "33", seconds: "25" },
      details: "5 PER WALLET + Price: 0.019 ETH",
      active: false,
      isPublic: true,
    },
  ],
  images: [
    "https://images.unsplash.com/photo-1741261498263-a5704667520d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1741261498263-a5704667520d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1741261498263-a5704667520d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1741261498263-a5704667520d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ],

};

export default function NFTDetails() {
  const [nftData, setNftData] = useState<NFTData>(initialNFTData)
  const [showCarousel, setShowCarousel] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)

  const handleOpenCarousel = (index: number) => {
    setCarouselIndex(index)
    setShowCarousel(true)
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - NFT Image */}
          <div className="lg:w-1/2 relative">
            <NFTImageGallery images={nftData.images} title={nftData.title} onOpenCarousel={handleOpenCarousel} />
          </div>

          {/* Right side - NFT Details */}
          <div className="lg:w-1/2">
            <NFTInfo data={nftData} onUpdateData={setNftData} />
          </div>
        </div>
      </div>

      {/* NFT Carousel Modal */}
      {showCarousel && (
        <NFTCarousel images={nftData.images} initialIndex={carouselIndex} onClose={() => setShowCarousel(false)} />
      )}
    </>
  )
}

