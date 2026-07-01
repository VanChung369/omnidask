import { describe, expect, it } from "vitest";
import {
  getPrivateRouteRedirect,
  getPublicOnlyRouteRedirect,
  privateRoutes,
  publicRoutes,
} from "@/app/guard-rules";
import { ROUTES } from "@/shared/constants";
import guardRulesSource from "../../src/app/guard-rules.ts?raw";

describe("route guards", () => {
  it("defines public and private route groups", () => {
    expect(publicRoutes.map((route) => route.path)).toEqual([
      ROUTES.LOGIN,
      ROUTES.REGISTER,
    ]);
    expect(privateRoutes.map((route) => route.path)).toEqual([
      ROUTES.DASHBOARD,
    ]);
  });

  it("uses shared route constants when declaring route groups", () => {
    expect(guardRulesSource).toContain("ROUTES.LOGIN");
    expect(guardRulesSource).toContain("ROUTES.REGISTER");
    expect(guardRulesSource).toContain("ROUTES.DASHBOARD");
    expect(guardRulesSource).not.toContain('path: "/login"');
    expect(guardRulesSource).not.toContain('path: "/register"');
    expect(guardRulesSource).not.toContain('path: "/dashboard"');
  });

  it("redirects anonymous users from private routes to login", () => {
    expect(
      getPrivateRouteRedirect({
        isAuthenticated: false,
        pathname: ROUTES.DASHBOARD,
      }),
    ).toBe("/login?redirectTo=%2Fdashboard");
  });

  it("allows authenticated users on private routes", () => {
    expect(
      getPrivateRouteRedirect({
        isAuthenticated: true,
        pathname: ROUTES.DASHBOARD,
      }),
    ).toBeNull();
  });

  it("redirects authenticated users away from public-only auth pages", () => {
    expect(
      getPublicOnlyRouteRedirect({
        isAuthenticated: true,
        fallbackPath: ROUTES.DASHBOARD,
      }),
    ).toBe(ROUTES.DASHBOARD);
  });

  it("allows anonymous users on public-only auth pages", () => {
    expect(
      getPublicOnlyRouteRedirect({
        isAuthenticated: false,
        fallbackPath: ROUTES.DASHBOARD,
      }),
    ).toBeNull();
  });
});
