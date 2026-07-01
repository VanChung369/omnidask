import { describe, expect, it } from "vitest";
import en from "@/locales/en.json";
import vi from "@/locales/vi.json";

const requiredKeys = [
  "common.appName",
  "common.home",
  "common.login",
  "common.dashboard",
  "common.logout",
  "common.password",
  "auth.login.eyebrow",
  "auth.login.title",
  "auth.login.description",
  "auth.login.emailLabel",
  "auth.login.passwordLabel",
  "auth.login.submitting",
  "auth.login.newWorkspace",
  "auth.login.createAccount",
  "auth.login.success",
  "auth.login.errorFallback",
  "auth.login.validation.email",
  "auth.login.validation.password",
  "auth.password.show",
  "auth.password.hide",
  "auth.register.validation.name",
  "auth.register.validation.email",
  "auth.register.validation.password",
  "home.heroTitle",
  "home.heroDescription",
  "home.openDashboard",
  "home.routesLabel",
  "home.publicRoute",
  "home.privateRoute",
  "dashboard.navLabel",
  "dashboard.eyebrow",
  "dashboard.welcome",
  "dashboard.fallbackUser",
  "dashboard.description",
  "dashboard.authenticatedArea",
  "dashboard.authenticatedDescription",
] as const;

function getValue(source: unknown, key: string) {
  return key.split(".").reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[segment];
  }, source);
}

describe("translations", () => {
  it.each([
    ["en", en],
    ["vi", vi],
  ])("defines required UI keys for %s", (_, translations) => {
    for (const key of requiredKeys) {
      expect(getValue(translations, key), key).toEqual(expect.any(String));
    }
  });
});
