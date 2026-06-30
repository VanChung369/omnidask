import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthUser = {
  name: string;
  email: string;
};

type AuthStore = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  register: (name: string, email: string) => void;
  logout: () => void;
};

function getDisplayName(email: string) {
  return email.split("@")[0] || "User";
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email) =>
        set({
          user: { name: getDisplayName(email), email },
          isAuthenticated: true,
        }),
      register: (name, email) =>
        set({
          user: { name: name.trim() || getDisplayName(email), email },
          isAuthenticated: true,
        }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "omnidask-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
