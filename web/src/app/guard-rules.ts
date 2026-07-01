import { ROUTES } from "@/shared/constants";

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
  { path: ROUTES.LOGIN, titleKey: "common.login" },
  { path: ROUTES.REGISTER, titleKey: "auth.login.createAccount" },
];

export const privateRoutes: AppRoute[] = [
  { path: ROUTES.DASHBOARD, titleKey: "common.dashboard" },
];

export function getPrivateRouteRedirect(
  input: PrivateRouteRedirectInput,
): string | null {
  if (input.isAuthenticated) {
    return null;
  }

  return `${ROUTES.LOGIN}?redirectTo=${encodeURIComponent(input.pathname)}`;
}

export function getPublicOnlyRouteRedirect(
  input: PublicOnlyRouteRedirectInput,
): string | null {
  if (!input.isAuthenticated) {
    return null;
  }

  return input.fallbackPath;
}
