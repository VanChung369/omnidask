export type AppRoute = {
  path: string;
  titleKey: string;
};

type PrivateRouteRedirectInput = {
  isAuthenticated: boolean;
  pathname: string;
};

type PublicOnlyRouteRedirectInput = {
  isAuthenticated: boolean;
  fallbackPath: string;
};

export const publicRoutes: AppRoute[] = [
  { path: "/", titleKey: "common.home" },
  { path: "/login", titleKey: "common.login" },
  { path: "/register", titleKey: "auth.login.createAccount" },
];

export const privateRoutes: AppRoute[] = [
  { path: "/dashboard", titleKey: "common.dashboard" },
];

export function getPrivateRouteRedirect(
  input: PrivateRouteRedirectInput,
): string | null {
  if (input.isAuthenticated) {
    return null;
  }

  return `/login?redirectTo=${encodeURIComponent(input.pathname)}`;
}

export function getPublicOnlyRouteRedirect(
  input: PublicOnlyRouteRedirectInput,
): string | null {
  if (!input.isAuthenticated) {
    return null;
  }

  return input.fallbackPath;
}
