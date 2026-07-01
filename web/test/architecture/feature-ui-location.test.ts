import { describe, expect, it } from "vitest";
import componentsConfig from "../../components.json";

const globalPageModules = import.meta.glob("../../src/components/pages/**/*.tsx", {
  eager: true,
});

const authModelModules = import.meta.glob("../../src/features/auth/model/**/*", {
  eager: true,
});

const homeFeatureModules = import.meta.glob("../../src/features/home/**/*", {
  eager: true,
});

const rootSharedFolderModules = import.meta.glob(
  [
    "../../src/components/**/*.{ts,tsx}",
    "../../src/constants/**/*.{ts,tsx}",
    "../../src/lib/**/*.{ts,tsx}",
    "../../src/providers/**/*.{ts,tsx}",
    "../../src/stores/**/*.{ts,tsx}",
  ],
  {
    eager: true,
  },
);

const sourceModules = import.meta.glob("../../src/**/*.{ts,tsx}", {
  eager: true,
  query: "?raw",
  import: "default",
});

describe("feature UI location", () => {
  it("does not keep page components in the global components/pages folder", () => {
    expect(Object.keys(globalPageModules)).toEqual([]);
  });

  it("does not import page components from the global components/pages folder", () => {
    const offenders = Object.entries(sourceModules)
      .filter(([, source]) =>
        String(source).includes("@/components/pages"),
      )
      .map(([filePath]) => filePath);

    expect(offenders).toEqual([]);
  });

  it("keeps auth store and types in explicit folders instead of auth/model", () => {
    expect(Object.keys(authModelModules)).toEqual([]);
  });

  it("does not import auth store or types from auth/model", () => {
    const offenders = Object.entries(sourceModules)
      .filter(([, source]) =>
        String(source).includes("@/features/auth/model"),
      )
      .map(([filePath]) => filePath);

    expect(offenders).toEqual([]);
  });

  it("keeps shared code under shared or app instead of root technical folders", () => {
    expect(Object.keys(rootSharedFolderModules)).toEqual([]);
  });

  it("does not import shared code from old root technical folders", () => {
    const oldRootImportPattern =
      /from\s+["']@\/(?:components|constants|lib|providers|stores)(?:\/|["'])/;

    const offenders = Object.entries(sourceModules)
      .filter(([, source]) => oldRootImportPattern.test(String(source)))
      .map(([filePath]) => filePath);

    expect(offenders).toEqual([]);
  });

  it("does not keep a home feature when the root route redirects to login", () => {
    expect(Object.keys(homeFeatureModules)).toEqual([]);
  });

  it("points shadcn aliases at shared folders", () => {
    expect(componentsConfig.aliases).toMatchObject({
      components: "@/shared/ui",
      utils: "@/shared/lib/utils",
      ui: "@/shared/ui/primitives",
      lib: "@/shared/lib",
      hooks: "@/shared/hooks",
    });
  });
});
