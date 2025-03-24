import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["i.imgur.com", "images.unsplash.com"],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["@radix-ui/react-*", "lucide-react"],
  },
  poweredByHeader: false,
};

export default nextConfig;
