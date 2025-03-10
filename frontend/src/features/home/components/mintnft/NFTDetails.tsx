"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Expand, Clock } from "lucide-react";
import NFTCarousel from "@/features/home/components/mintnft/NFTCarousel";

const NFTDetails = () => {
  const [nftData, setNftData] = useState({
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
      "https://images.unsplash.com/photo-1741334632363-58022899ce91?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1741334632363-58022899ce91?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1741334632363-58022899ce91?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1741334632363-58022899ce91?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
  });
  const [showCarousel, setShowCarousel] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const percentMinted = (nftData.totalMinted / nftData.totalSupply) * 100;

  return (
    <>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - NFT Image */}
          <div className="lg:w-1/2 relative">
            <div className="bg-gradient-to-b from-purple-900/50 to-purple-950 rounded-lg p-4 relative">
              <div className="absolute top-4 right-4 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white rounded-md"
                  onClick={() => {
                    setShowCarousel(true);
                    setCurrentImageIndex(currentImageIndex);
                  }}
                >
                  <Expand className="h-5 w-5" />
                </Button>
              </div>
              <div className="aspect-square relative rounded-md overflow-hidden">
                <Image
                  src={nftData.images[currentImageIndex] || "/placeholder.svg"}
                  alt={nftData.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {nftData.images.map((image, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-24 h-24 relative rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200 hover:opacity-90 ${
                      index === currentImageIndex
                        ? "border-purple-500"
                        : "border-transparent"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${nftData.title} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - NFT Details */}
          <div className="lg:w-1/2">
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-green-500 text-black text-xs font-bold px-2 py-1 rounded">
                  ABS
                </div>
                <h1 className="text-xl md:text-2xl font-bold">
                  {nftData.title}
                </h1>
              </div>

              {/* Mint Stages */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Mint Stages</h2>

                {nftData.mintStages.map((stage, index) => (
                  <div
                    key={index}
                    className={`mb-3 p-4 rounded-lg cursor-pointer transition-all duration-200 
  ${
    stage.active
      ? "bg-pink-950/50 border border-pink-500"
      : "bg-gray-800 hover:bg-gray-700"
  }`}
                    onClick={() => {
                      // Update mint stages to set this one as active
                      const updatedStages = [...nftData.mintStages].map(
                        (s, i) => ({
                          ...s,
                          active: i === index,
                        })
                      );
                      setNftData({ ...nftData, mintStages: updatedStages });
                    }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <Clock
                          className={`h-4 w-4 ${
                            stage.active ? "text-pink-500" : "text-gray-400"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            stage.active ? "text-pink-500" : "text-gray-400"
                          }`}
                        >
                          {stage.name}
                        </span>
                        {stage.isPublic && (
                          <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">
                            Public
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {stage.status}{" "}
                        <span className="font-mono">
                          {stage.time.days}:{stage.time.hours}:
                          {stage.time.minutes}:{stage.time.seconds}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-300">{stage.details}</div>
                  </div>
                ))}
              </div>

              {/* Minting Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Live</span>
                  </div>
                  <div className="text-sm">Total Minted</div>
                </div>
                <div className="mb-1">
                  <Progress value={percentMinted} className="h-2 bg-gray-800" />
                </div>
                <div className="flex justify-end text-sm text-gray-300">
                  {percentMinted.toFixed(0)}% ({nftData.totalMinted}/
                  {nftData.totalSupply})
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="text-sm text-gray-400 mb-1">Price</div>
                <div className="text-2xl font-bold">{nftData.currentPrice}</div>
                <div className="text-sm text-gray-400 mt-1">
                  Mint fee: {nftData.ethPrice}
                </div>
              </div>

              {/* Email Input */}
              <div className="mb-6">
                <div className="text-sm text-gray-400 mb-2">
                  Email Address (Optional)
                </div>
                <Input
                  type="email"
                  placeholder="hello@example.com"
                  className="bg-gray-800 border-gray-700"
                />
                <div className="text-xs text-gray-500 mt-2">
                  By clicking aaa, you agree to the Magic Eden Terms of Service.
                </div>
              </div>

              {/* Mint Button */}
              <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-6">
                You can mint in 2h 33m 26s
              </Button>

              {/* Explore Collection */}
              <Button
                variant="outline"
                className="w-full mt-4 border-gray-700 text-gray-300"
              >
                Explore Collection
                <Expand className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* NFT Carousel Modal */}
      {showCarousel && (
        <NFTCarousel
          images={nftData.images}
          initialIndex={currentImageIndex}
          onClose={() => setShowCarousel(false)}
        />
      )}
    </>
  );
};

export default NFTDetails;
