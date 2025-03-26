export const mockChains = [
  {
    id: "base",
    name: "Base",
    icon: "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?24x24",
    symbol: "SOL",
    color: "#14F195",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    icon: "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?24x24",
    symbol: "ETH",
    color: "#627EEA",
  },
  {
    id: "polygon",
    name: "Polygon",
    icon: "https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?24x24",
    symbol: "MATIC",
    color: "#8247E5",
  }

];

export const mockCollections = [
  {
    id: "collection-1",
    name: "Cosmic Voyagers",
    chain: { id: "solana" },
    floorPrice: 2.5,
    volume: 120,
  },
  {
    id: "collection-2",
    name: "Digital Dreamers",
    chain: { id: "ethereum" },
    floorPrice: 1.8,
    volume: 85,
  },
  {
    id: "collection-3",
    name: "Neon Nomads",
    chain: { id: "polygon" },
    floorPrice: 0.9,
    volume: 45,
  },
  {
    id: "collection-4",
    name: "Pixel Pioneers",
    chain: { id: "solana" },
    floorPrice: 3.2,
    volume: 150,
  },
  {
    id: "collection-5",
    name: "Ethereal Entities",
    chain: { id: "ethereum" },
    floorPrice: 4.1,
    volume: 210,
  },
  {
    id: "collection-6",
    name: "Quantum Questers",
    chain: { id: "binance" },
    floorPrice: 1.5,
    volume: 75,
  },
  {
    id: "collection-7",
    name: "Astral Artifacts",
    chain: { id: "avalanche" },
    floorPrice: 2.2,
    volume: 95,
  },
  {
    id: "collection-8",
    name: "Mystic Mavericks",
    chain: { id: "polygon" },
    floorPrice: 1.1,
    volume: 60,
  },
];

export const mockNFTs = Array(16)
  .fill(null)
  .map((_, index) => {
    const chainIndex = Math.floor(Math.random() * mockChains.length);
    const collectionIndex = Math.floor(Math.random() * mockCollections.length);

    return {
      id: `nft-${index}`,
      name: `Cosmic NFT #${index + 1}`,
      description: "A unique digital collectible from the cosmic universe.",
      image: `https://images.unsplash.com/photo-1742435456486-3a0059c05e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?400x400`,
      price: (0.5 + Math.random() * 4).toFixed(2),
      owner: {
        id: `user-${Math.floor(Math.random() * 10)}`,
        name: `Collector${Math.floor(Math.random() * 100)}`,
      },
      collection: mockCollections[collectionIndex],
      chain: mockChains[chainIndex],
      attributes: [
        {
          trait_type: "Background",
          value: ["Cosmic", "Nebula", "Starfield", "Galaxy"][
            Math.floor(Math.random() * 4)
          ],
        },
        {
          trait_type: "Rarity",
          value: ["Common", "Uncommon", "Rare", "Epic", "Legendary"][
            Math.floor(Math.random() * 5)
          ],
        },
        {
          trait_type: "Element",
          value: ["Fire", "Water", "Earth", "Air", "Ether"][
            Math.floor(Math.random() * 5)
          ],
        },
      ],
    };
  });
