import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["i.imgur.com", "images.unsplash.com"],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["@radix-ui/react-*", "lucide-react"],
  },
  poweredByHeader: false,
};

export default nextConfig;
