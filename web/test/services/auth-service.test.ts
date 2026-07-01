import { beforeEach, describe, expect, it, vi } from "vitest";
import { authService } from "@/services/auth-service";
import { API_ENDPOINTS } from "@/constants/api";
import { http } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  http: {
    post: vi.fn(),
  },
}));

describe("authService", () => {
  beforeEach(() => {
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
});
