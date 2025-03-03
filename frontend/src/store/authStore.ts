import { create } from "zustand";

type AuthStore = {
  user: null | { id: string; email: string; role: string };
  setUser: (user: { id: string; email: string; role: string }) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
