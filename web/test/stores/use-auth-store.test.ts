import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/stores/use-auth-store";
import { clearApiAccessToken, setApiAccessToken } from "@/lib/api";

vi.mock("@/lib/api", () => ({
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
      accessToken: null,
      user: null,
      workspaces: [],
      isAuthenticated: false,
    });
    expect(clearApiAccessToken).toHaveBeenCalledOnce();
  });
});
