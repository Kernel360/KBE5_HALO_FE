import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  email: string | null;
  userName: string | null;
  status: string | null;
  setUser: (email: string, userName: string, status: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      email: null,
      userName: null,
      status: null,
      setUser: (email, userName, status) => set({ email, userName, status }),
      clearUser: () => set({ email: null, userName: null, status: null }),
    }),
    { name: "user-storage" }
  )
);