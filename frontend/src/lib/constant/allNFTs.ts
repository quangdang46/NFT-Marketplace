import type { NFT } from "@/types/nft";

export const mockNFTs: NFT[] = [
  {
    id: "#4599",
    image: "/placeholder.svg",
    price: "0.0276",
    lastPrice: "0.02751",
    selected: true,
    background: "olive",
  },
  {
    id: "#3396",
    image: "/placeholder.svg",
    price: "0.0277",
    lastPrice: "0.02401",
    selected: true,
    background: "teal",
  },
  {
    id: "#1996",
    image: "/placeholder.svg",
    price: "0.02817",
    lastPrice: "",
    selected: true,
    background: "orange",
  },
  {
    id: "#4500",
    image: "/placeholder.svg",
    price: "0.02817",
    lastPrice: "",
    selected: false,
    background: "purple",
  },
  {
    id: "#7437",
    image: "/placeholder.svg",
    price: "0.02817",
    lastPrice: "",
    selected: false,
    background: "beige",
  },
  {
    id: "#8853",
    image: "/placeholder.svg",
    price: "0.0299",
    lastPrice: "",
    selected: false,
    background: "darkred",
  },
  {
    id: "#2506",
    image: "/placeholder.svg",
    price: "0.03",
    lastPrice: "",
    selected: false,
    background: "gold",
  },
  {
    id: "#3207",
    image: "/placeholder.svg",
    price: "0.03235",
    lastPrice: "",
    selected: false,
    background: "gray",
  },
];

// Thêm nhiều NFT hơn để demo
export const allNFTs: NFT[] = [
  ...mockNFTs,
  ...Array(16)
    .fill(0)
    .map((_, i) => ({
      id: `#${(10000 + i).toString()}`,
      image: "/placeholder.svg",
      price: (0.03 + i * 0.001).toFixed(5),
      lastPrice: i % 2 === 0 ? (0.029 + i * 0.0005).toFixed(5) : "",
      selected: false,
      background: [
        "olive",
        "teal",
        "orange",
        "purple",
        "beige",
        "darkred",
        "gold",
        "gray",
      ][i % 8],
    })),
];
