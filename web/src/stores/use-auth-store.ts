import { create } from "zustand";
import { persist } from "zustand/middleware";
import { clearApiAccessToken, setApiAccessToken } from "@/lib/api";
import type { AuthResponse, AuthUser, AuthWorkspace } from "@/types/auth";

type AuthStore = {
  accessToken: string | null;
  user: AuthUser | null;
  workspaces: AuthWorkspace[];
  isAuthenticated: boolean;
  login: (response: AuthResponse) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      workspaces: [],
      isAuthenticated: false,
      login: (response) => {
        setApiAccessToken(response.accessToken);
        set({
          accessToken: response.accessToken,
          user: response.user,
          workspaces: response.workspaces,
          isAuthenticated: true,
        });
      },
      logout: () => {
        clearApiAccessToken();
        set({
          accessToken: null,
          user: null,
          workspaces: [],
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "omnidask-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        workspaces: state.workspaces,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          setApiAccessToken(state.accessToken);
        }
      },
    },
  ),
);
