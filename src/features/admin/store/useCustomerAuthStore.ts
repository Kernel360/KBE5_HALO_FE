import { create } from "zustand";
import type { AuthState } from "@/types/auth";

export const useCustomerAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false }),
}));
