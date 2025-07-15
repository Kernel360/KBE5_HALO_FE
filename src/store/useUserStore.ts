import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  email: string | null
  userName: string | null
  status: string | null
  provider: string | null
  providerId: string | null
  setUser: (
    email: string,
    userName: string,
    status: string,
    provider: string | null,
    providerId: string | null
  ) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    set => ({
      email: null,
      userName: null,
      status: null,
      provider: null,
      providerId: null,
      setUser: (email, userName, status, provider, providerId) => set({ email, userName, status, provider, providerId }),
      clearUser: () =>
        set({
          email: null,
          userName: null,
          status: null,
          provider: null,
          providerId: null
        })
    }),
    { name: 'user-storage' }
  )
)