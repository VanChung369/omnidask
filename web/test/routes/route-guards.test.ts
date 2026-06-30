import { describe, expect, it } from "vitest";
import {
  getPrivateRouteRedirect,
  getPublicOnlyRouteRedirect,
  privateRoutes,
  publicRoutes,
} from "@/routes/route-guards";

describe("route guards", () => {
  it("defines public and private route groups", () => {
    expect(publicRoutes.map((route) => route.path)).toEqual([
      "/",
      "/login",
      "/register",
    ]);
    expect(privateRoutes.map((route) => route.path)).toEqual(["/dashboard"]);
  });

  it("redirects anonymous users from private routes to login", () => {
    expect(
      getPrivateRouteRedirect({
        isAuthenticated: false,
        pathname: "/dashboard",
      }),
    ).toBe("/login?redirectTo=%2Fdashboard");
  });

  it("allows authenticated users on private routes", () => {
    expect(
      getPrivateRouteRedirect({
        isAuthenticated: true,
        pathname: "/dashboard",
      }),
    ).toBeNull();
  });

  it("redirects authenticated users away from public-only auth pages", () => {
    expect(
      getPublicOnlyRouteRedirect({
        isAuthenticated: true,
        fallbackPath: "/dashboard",
      }),
    ).toBe("/dashboard");
  });

  it("allows anonymous users on public-only auth pages", () => {
    expect(
      getPublicOnlyRouteRedirect({
        isAuthenticated: false,
        fallbackPath: "/dashboard",
      }),
    ).toBeNull();
  });
});
