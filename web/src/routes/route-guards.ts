export type AppRoute = {
  path: string;
  title: string;
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
  { path: "/", title: "Home" },
  { path: "/login", title: "Login" },
  { path: "/register", title: "Register" },
];

export const privateRoutes: AppRoute[] = [
  { path: "/dashboard", title: "Dashboard" },
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
