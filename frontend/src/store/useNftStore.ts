import { create } from "zustand";

interface NFTStore {
  selectedBlockchain: Blockchain | "ALL";
  setSelectedBlockchain: (blockchain: Blockchain | "ALL") => void;
  filteredCollections: () => NFTCollection[];
}

export const useNftStore = create<NFTStore>((set) => ({
  selectedBlockchain: "ALL",
  setSelectedBlockchain: (blockchain) =>
    set({ selectedBlockchain: blockchain }),
  filteredCollections: () => {
    const { collections, selectedBlockchain } = get();
    if (selectedBlockchain === "ALL") {
      return collections;
    }
    return collections.filter(
      (collection) => collection.blockchain === selectedBlockchain
    );
  },
}));
