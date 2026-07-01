import { create } from 'zustand'

type AppStore = {
  sidebarOpen: boolean
  setSidebarOpen: (sidebarOpen: boolean) => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppStore>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}))
