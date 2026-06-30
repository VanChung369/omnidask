import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/use-auth-store";
import {
  getPrivateRouteRedirect,
  getPublicOnlyRouteRedirect,
} from "./route-guards";
import { ROUTES } from "@/constants";

const DEFAULT_AUTHENTICATED_PATH = ROUTES.DASHBOARD;

function useCurrentPath() {
  const location = useLocation();
  return `${location.pathname}${location.search}`;
}

export function PrivateRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentPath = useCurrentPath();
  const redirect = getPrivateRouteRedirect({
    isAuthenticated,
    pathname: currentPath,
  });

  if (redirect) {
    return <Navigate to={redirect} replace />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const redirect = getPublicOnlyRouteRedirect({
    isAuthenticated,
    fallbackPath: DEFAULT_AUTHENTICATED_PATH,
  });

  if (redirect) {
    return <Navigate to={redirect} replace />;
  }

  return <Outlet />;
}
