import { describe, expect, it, vi } from "vitest";
import { useMutation } from "@tanstack/react-query";
import { useLoginMutation } from "@/features/auth/hooks/use-login-mutation";
import { authService } from "@/features/auth/api/auth.api";

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn((options) => options),
}));

vi.mock("@/features/auth/api/auth.api", () => ({
  authService: {
    login: vi.fn(),
  },
}));

describe("useLoginMutation", () => {
  it("uses React Query to call the auth service login API", () => {
    const result = useLoginMutation();

    expect(useMutation).toHaveBeenCalledWith({
      mutationFn: authService.login,
    });
    expect(result).toEqual({
      mutationFn: authService.login,
    });
  });
});
