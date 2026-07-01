import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { clearApiAccessToken, setApiAccessToken } from "@/shared/api/http";

vi.mock("@/shared/api/http", () => ({
  clearApiAccessToken: vi.fn(),
  setApiAccessToken: vi.fn(),
}));

const authResponse = {
  accessToken: "access-token",
  tokenType: "Bearer",
  expiresIn: 900,
  user: {
    id: "user-1",
    email: "demo@omnidask.local",
    displayName: "Demo User",
  },
  workspaces: [
    {
      id: "workspace-1",
      name: "Demo Workspace",
      slug: "demo",
      timezone: "Asia/Ho_Chi_Minh",
      role: "owner",
    },
  ],
};

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      status: "anonymous",
      accessToken: null,
      user: null,
      workspaces: [],
      isAuthenticated: false,
    });
    vi.mocked(clearApiAccessToken).mockReset();
    vi.mocked(setApiAccessToken).mockReset();
  });

  it("stores the authenticated session and installs the bearer token", () => {
    useAuthStore.getState().login(authResponse);

    expect(useAuthStore.getState()).toMatchObject({
      status: "authenticated",
      accessToken: "access-token",
      user: authResponse.user,
      workspaces: authResponse.workspaces,
      isAuthenticated: true,
    });
    expect(setApiAccessToken).toHaveBeenCalledWith("access-token");
  });

  it("initializes a refreshed session without needing persisted storage", () => {
    useAuthStore.getState().initialize({
      accessToken: authResponse.accessToken,
      user: authResponse.user,
      workspaces: authResponse.workspaces,
    });

    expect(useAuthStore.getState()).toMatchObject({
      status: "authenticated",
      accessToken: "access-token",
      user: authResponse.user,
      workspaces: authResponse.workspaces,
      isAuthenticated: true,
    });
    expect(setApiAccessToken).toHaveBeenCalledWith("access-token");
  });

  it("clears the authenticated session and bearer token on logout", () => {
    useAuthStore.getState().login(authResponse);

    useAuthStore.getState().logout();

    expect(useAuthStore.getState()).toMatchObject({
      status: "anonymous",
      accessToken: null,
      user: null,
      workspaces: [],
      isAuthenticated: false,
    });
    expect(clearApiAccessToken).toHaveBeenCalledOnce();
  });

  it("marks the session anonymous when bootstrap cannot refresh", () => {
    useAuthStore.getState().setAnonymous();

    expect(useAuthStore.getState()).toMatchObject({
      status: "anonymous",
      accessToken: null,
      user: null,
      workspaces: [],
      isAuthenticated: false,
    });
    expect(clearApiAccessToken).toHaveBeenCalledOnce();
  });
});
