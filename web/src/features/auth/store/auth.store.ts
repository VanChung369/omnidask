import { create } from "zustand";
import { clearApiAccessToken, setApiAccessToken } from "@/shared/api/http";
import {
  forgetClientAuthSession,
  hasClientAuthSession,
  rememberClientAuthSession,
} from "../session/auth-session-marker";
import type {
  AuthResponse,
  AuthSession,
  AuthUser,
  AuthWorkspace,
} from "../types/auth.types";

type AuthStatus = "booting" | "authenticated" | "anonymous";

type AuthStore = {
  status: AuthStatus;
  accessToken: string | null;
  user: AuthUser | null;
  workspaces: AuthWorkspace[];
  isAuthenticated: boolean;
  initialize: (session: AuthSession) => void;
  login: (response: AuthResponse) => void;
  setAnonymous: () => void;
  logout: () => void;
};

const anonymousState = {
  status: "anonymous" as const,
  accessToken: null,
  user: null,
  workspaces: [],
  isAuthenticated: false,
};

const initialStatus: AuthStatus = hasClientAuthSession()
  ? "booting"
  : "anonymous";

export const useAuthStore = create<AuthStore>()((set) => ({
  status: initialStatus,
  accessToken: null,
  user: null,
  workspaces: [],
  isAuthenticated: false,
  initialize: (session) => {
    rememberClientAuthSession();
    setApiAccessToken(session.accessToken);
    set({
      status: "authenticated",
      accessToken: session.accessToken,
      user: session.user,
      workspaces: session.workspaces,
      isAuthenticated: true,
    });
  },
  login: (response) => {
    rememberClientAuthSession();
    setApiAccessToken(response.accessToken);
    set({
      status: "authenticated",
      accessToken: response.accessToken,
      user: response.user,
      workspaces: response.workspaces,
      isAuthenticated: true,
    });
  },
  setAnonymous: () => {
    forgetClientAuthSession();
    clearApiAccessToken();
    set(anonymousState);
  },
  logout: () => {
    forgetClientAuthSession();
    clearApiAccessToken();
    set(anonymousState);
  },
}));
