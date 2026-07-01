import { describe, expect, it } from "vitest";

import appRouterSource from "../../src/app/router.tsx?raw";
import routeConstantsSource from "../../src/shared/constants/routes.ts?raw";

describe("app router", () => {
  it("redirects the root path to login instead of rendering a home feature", () => {
    expect(appRouterSource).not.toContain("HomeFeature");
    expect(appRouterSource).not.toContain("ROUTES.HOME");
    expect(appRouterSource).toContain('path="/"');
    expect(appRouterSource).toContain("to={ROUTES.LOGIN}");
  });

  it("does not expose a HOME route constant for the root redirect", () => {
    expect(routeConstantsSource).not.toContain("HOME:");
  });
});
