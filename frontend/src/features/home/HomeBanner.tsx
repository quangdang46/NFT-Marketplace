"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function HomeBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Discover, Collect, and Sell Extraordinary NFTs",
      description:
        "Explore the best multi-chain NFT marketplace with thousands of digital assets across Ethereum, Solana, Polygon and more.",
      image:
        "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?500x1200",
      color1: "hsl(var(--primary))",
      color2: "#7928ca",
    },
    {
      title: "Join the NFT Revolution",
      description:
        "Create and trade NFTs across multiple blockchains with low fees and high security.",
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
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden mb-12 group">
      {/* Background with gradient overlay */}
      {slides.map((slide, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: currentSlide === index ? 1 : 0 }}
          transition={{ duration: 0.7 }}
          style={{
            background: `linear-gradient(to right, ${slide.color1}20, ${slide.color2}10), url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent"></div>
        </motion.div>
      ))}

      {/* Animated particles or shapes */}
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
            background: `linear-gradient(45deg, ${slides[currentSlide].color1}, ${slides[currentSlide].color2})`,
          }}
        ></motion.div>

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
            background: `linear-gradient(45deg, ${slides[currentSlide].color2}, ${slides[currentSlide].color1})`,
          }}
        ></motion.div>
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-center h-full p-8 md:p-12 max-w-2xl">
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            className={`${currentSlide === index ? "block" : "hidden"}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: currentSlide === index ? 1 : 0,
              x: currentSlide === index ? 0 : -20,
            }}
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

            <p className="text-lg md:text-xl mb-8 text-muted-foreground max-w-lg">
              {slide.description}
            </p>
          </motion.div>
        ))}

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
            <Button size="lg" variant="outline">
              <Sparkles className="mr-2 h-4 w-4" />
              Live Auctions
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="flex gap-8 mt-12">
          <div>
            <p
              className="text-3xl font-bold text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(to right, ${slides[currentSlide].color1}, ${slides[currentSlide].color2})`,
              }}
            >
              10K+
            </p>
            <p className="text-muted-foreground">Artworks</p>
          </div>
          <div>
            <p
              className="text-3xl font-bold text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(to right, ${slides[currentSlide].color1}, ${slides[currentSlide].color2})`,
              }}
            >
              3.2K+
            </p>
            <p className="text-muted-foreground">Artists</p>
          </div>
          <div>
            <p
              className="text-3xl font-bold text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(to right, ${slides[currentSlide].color1}, ${slides[currentSlide].color2})`,
              }}
            >
              8.5K+
            </p>
            <p className="text-muted-foreground">Collectors</p>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "w-6 bg-white"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
