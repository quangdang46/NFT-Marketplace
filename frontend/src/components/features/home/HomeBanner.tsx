"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { Stats } from "@/lib/api/graphql/generated";

// Slide interface
interface Slide {
  title: string;
  description: string;
  image: string;
  color1: string;
  color2: string;
}

interface HomeBannerProps {
  stats: Stats;
  chain: string | null;
}

// Get chain slides function
const getChainSlides = (stats: Stats, chain: string | null): Slide[] => {
  const slides: Record<string, Slide[]> = {
    all: [
      {
        title: `Explore ${stats.artworks.toLocaleString()} NFTs Across All Chains`,
        description:
          "Discover thousands of digital assets on Ethereum, Sepolia, Polygon, and more. Join the largest multi-chain NFT marketplace!",
        image:
          "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?500x1200",
        color1: "#00dfd8",
        color2: "#7928ca",
      },
      {
        title: "Join the NFT Revolution",
        description: `Create and trade NFTs across multiple blockchains with ${stats.artists.toLocaleString()} artists and low fees.`,
        image:
          "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?500x1200",
        color1: "#0070f3",
        color2: "#00dfd8",
      },
      {
        title: "Exclusive Auctions & Drops",
        description:
          "Participate in exclusive NFT auctions and get early access to limited edition drops.",
        image:
          "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?500x1200",
        color1: "#ff4d4d",
        color2: "#f9cb28",
      },
    ],
    "11155111": [
      {
        title: `Test ${stats.artworks.toLocaleString()} NFTs on Sepolia`,
        description:
          "Discover unique NFTs on the Sepolia testnet, perfect for testing and development.",
        image:
          "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=2074&auto=format&fit=crop",
        color1: "#ff6f61",
        color2: "#6b7280",
      },
      {
        title: "Experiment with Zero Risk",
        description: `Create and trade NFTs on Sepolia with ${stats.artists.toLocaleString()} creators and low gas fees.`,
        image:
          "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2074&auto=format&fit=crop",
        color1: "#ff6f61",
        color2: "#6b7280",
      },
    ],
    "1": [
      {
        title: `Discover ${stats.artworks.toLocaleString()} Premium Ethereum NFTs`,
        description:
          "Trade high-value NFTs on Ethereum, the leading blockchain for digital assets.",
        image:
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop",
        color1: "#3b82f6",
        color2: "#8b5cf6",
      },
      {
        title: "Join Ethereum's NFT Elite",
        description: `Own exclusive NFTs from ${stats.artists.toLocaleString()} top artists on the Ethereum blockchain.`,
        image:
          "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?q=80&w=2072&auto=format&fit=crop",
        color1: "#3b82f6",
        color2: "#8b5cf6",
      },
    ],
  };

  return slides[chain || "all"] || slides["all"];
};

// Slide Content Component
function SlideContent({
  slide,
  isActive,
}: {
  slide: Slide;
  isActive: boolean;
}) {
  return (
    <motion.div
      className={`${isActive ? "block" : "hidden"}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -20 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage: `linear-gradient(to right, ${slide.color1}, ${slide.color2})`,
          }}
        >
          {slide.title}
        </span>
      </h1>
      <p className="text-lg md:text-xl mb-8 text-gray-700 dark:text-gray-300 max-w-lg">
        {slide.description}
      </p>
    </motion.div>
  );
}

// Stats Display Component
function StatsDisplay({
  stats,
  currentSlide,
  slides,
}: {
  stats: Stats;
  currentSlide: number;
  slides: Slide[];
}) {
  const currentColors = slides[currentSlide] || slides[0];
  return (
    <div className="flex gap-8 mt-12">
      {[
        { value: stats.artworks, label: "Artworks" },
        { value: stats.artists, label: "Artists" },
        { value: stats.collectors, label: "Collectors" },
      ].map((stat, index) => (
        <div key={index}>
          <p
            className="text-3xl font-bold text-transparent bg-clip-text"
            style={{
              backgroundImage: `linear-gradient(to right, ${currentColors.color1}, ${currentColors.color2})`,
            }}
          >
            {stat.value !== undefined
              ? `${stat.value.toLocaleString()}+`
              : "N/A"}
          </p>
          <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

// Navigation Dots Component
function NavigationDots({
  slides,
  currentSlide,
  onDotClick,
}: {
  slides: Slide[];
  currentSlide: number;
  onDotClick: (index: number) => void;
}) {
  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
      {slides.map((_, index) => (
        <button
          key={index}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            currentSlide === index
              ? "w-6 bg-primary"
              : "bg-gray-400/50 hover:bg-gray-400/80 dark:bg-white/50 dark:hover:bg-white/80"
          }`}
          onClick={() => onDotClick(index)}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}

const Background = ({
  slide,
  currentSlide,
  index,
}: {
  slide: Slide;
  currentSlide: number;
  index: number;
}) => {
  return (
    <motion.div
      key={index}
      className="absolute inset-0 z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: currentSlide === index ? 1 : 0 }}
      transition={{ duration: 0.7 }}
      style={{
        backgroundImage: `linear-gradient(to right, ${slide.color1}20, ${slide.color2}10), url(${slide.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent dark:from-[#121620]/90 dark:via-[#121620]/70 dark:to-transparent"></div>
    </motion.div>
  );
};

const Buttons = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Link href="/collections" className="w-fit">
        <Button
          size="lg"
          className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-medium"
        >
          Explore Collections
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
      <Link href="/auctions" className="w-fit">
        <Button
          size="lg"
          variant="outline"
          className="border-gray-300  hover:bg-gray-100 dark:border-white/10 text-white dark:hover:bg-white/5"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Live Auctions
        </Button>
      </Link>
    </div>
  );
};

export function HomeBanner({ stats, chain }: HomeBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = getChainSlides(stats, chain);

  // Reset currentSlide when chain changes
  useEffect(() => {
    setCurrentSlide(0); // Reset to first slide when chain changes
  }, [chain]);

  // Slide interval effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  // Safeguard: Ensure slides is not empty
  if (!slides || slides.length === 0) {
    return <div>Loading slides...</div>;
  }

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden mb-12 group bg-gray-50 dark:bg-[#1A1F2C] border border-gray-200 dark:border-white/10">
      {/* Background with gradient overlay */}
      {slides.map((slide, index) => (
        <Background
          key={index}
          slide={slide}
          currentSlide={currentSlide}
          index={index}
        />
      ))}

      {/* Animated particles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute w-64 h-64 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{
            top: "-20px",
            left: "-20px",
            background: `linear-gradient(45deg, ${
              slides[currentSlide]?.color1 || "#000"
            }, ${slides[currentSlide]?.color2 || "#000"})`,
          }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, -30, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.5,
          }}
          style={{
            bottom: "-40px",
            right: "-20px",
            background: `linear-gradient(45deg, ${
              slides[currentSlide]?.color2 || "#000"
            }, ${slides[currentSlide]?.color1 || "#000"})`,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col justify-center h-full p-8 md:p-12 max-w-2xl">
        {slides.map((slide, index) => (
          <SlideContent
            key={index}
            slide={slide}
            isActive={currentSlide === index}
          />
        ))}
        <Buttons />
        <StatsDisplay
          stats={stats}
          currentSlide={currentSlide}
          slides={slides}
        />
        <NavigationDots
          slides={slides}
          currentSlide={currentSlide}
          onDotClick={handleDotClick}
        />
      </div>
    </div>
  );
}

