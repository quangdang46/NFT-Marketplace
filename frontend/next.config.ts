import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["@radix-ui/react-*", "lucide-react"],
  },
  poweredByHeader: false,
};

export default nextConfig;
