import { create } from "zustand";
export type Blockchain = "BTC" | "ETH" | "SOL" | "ABS" | "ALL";
interface NFTStore {
  selectedBlockchain: Blockchain | "ALL";
  setSelectedBlockchain: (blockchain: Blockchain | "ALL") => void;
}

export const useNftStore = create<NFTStore>((set) => ({
  selectedBlockchain: "ALL",
  setSelectedBlockchain: (blockchain) =>
    set({ selectedBlockchain: blockchain }),
}));
