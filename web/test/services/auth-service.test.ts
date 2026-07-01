import { beforeEach, describe, expect, it, vi } from "vitest";
import { authService } from "@/features/auth/api/auth.api";
import { API_ENDPOINTS } from "@/shared/constants/api";
import { http } from "@/shared/api/http";

vi.mock("@/shared/api/http", () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("authService", () => {
  beforeEach(() => {
    vi.mocked(http.get).mockReset();
    vi.mocked(http.post).mockReset();
  });

  it("logs in with the backend auth contract", async () => {
    const response = {
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

    vi.mocked(http.post).mockResolvedValue(response);

    await expect(
      authService.login({
        email: "demo@omnidask.local",
        password: "password123456",
      }),
    ).resolves.toEqual(response);

    expect(http.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.LOGIN, {
      email: "demo@omnidask.local",
      password: "password123456",
    });
  });

  it("refreshes the session with the refresh-cookie endpoint", async () => {
    const response = {
      accessToken: "new-access-token",
      tokenType: "Bearer",
      expiresIn: 900,
      user: {
        id: "user-1",
        email: "demo@omnidask.local",
        displayName: "Demo User",
      },
      workspaces: [],
    };

    vi.mocked(http.post).mockResolvedValue(response);

    await expect(authService.refresh()).resolves.toEqual(response);

    expect(http.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.REFRESH);
  });

  it("loads the current session with the access token", async () => {
    const response = {
      user: {
        id: "user-1",
        email: "demo@omnidask.local",
        displayName: "Demo User",
      },
      workspaces: [],
    };

    vi.mocked(http.get).mockResolvedValue(response);

    await expect(authService.me()).resolves.toEqual(response);

    expect(http.get).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.ME);
  });

  it("logs out through the backend session endpoint", async () => {
    vi.mocked(http.post).mockResolvedValue(undefined);

    await expect(authService.logout()).resolves.toBeUndefined();

    expect(http.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.LOGOUT);
  });
});
