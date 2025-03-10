import { create } from "zustand";

interface InfoState {
  chain: string;
  setChain: (newChain: string) => void;
}

export const useInfoStore = create<InfoState>((set) => ({
  chain: "all",
  setChain: (newChain: string) => set({ chain: newChain }),
}));
