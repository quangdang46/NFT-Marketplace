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
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
    dangerouslyAllowSVG: true,
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["@radix-ui/react-*", "lucide-react"],
  },
  poweredByHeader: false,
};

export default nextConfig;
