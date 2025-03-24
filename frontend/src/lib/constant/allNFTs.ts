import type { NFT } from "@/types/nft";

export const mockNFTs: NFT[] = [
  {
    id: "#4599",
    image:
      "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20",
    price: "0.0276",
    lastPrice: "0.02751",
    selected: true,
    background: "olive",
  },
  {
    id: "#3396",
    image:
      "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20",
    price: "0.0277",
    lastPrice: "0.02401",
    selected: true,
    background: "teal",
  },
  {
    id: "#1996",
    image:
      "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20",
    price: "0.02817",
    lastPrice: "",
    selected: true,
    background: "orange",
  },
  {
    id: "#4500",
    image:
      "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20",
    price: "0.02817",
    lastPrice: "",
    selected: false,
    background: "purple",
  },
  {
    id: "#7437",
    image:
      "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20",
    price: "0.02817",
    lastPrice: "",
    selected: false,
    background: "beige",
  },
  {
    id: "#8853",
    image:
      "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20",
    price: "0.0299",
    lastPrice: "",
    selected: false,
    background: "darkred",
  },
  {
    id: "#2506",
    image:
      "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20",
    price: "0.03",
    lastPrice: "",
    selected: false,
    background: "gold",
  },
  {
    id: "#3207",
    image:
      "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20",
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
      image:
        "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?20x20",
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
