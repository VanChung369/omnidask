import { Navigate, Outlet, useLocation } from "react-router-dom";

import { ROUTES } from "@/shared/constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import {
  getPrivateRouteRedirect,
  getPublicOnlyRouteRedirect,
} from "./guard-rules";

function useCurrentPath() {
  const location = useLocation();
  return `${location.pathname}${location.search}`;
}

export function PrivateRoute() {
  const status = useAuthStore((state) => state.status);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentPath = useCurrentPath();
  const redirect = getPrivateRouteRedirect({
    isAuthenticated,
    pathname: currentPath,
  });

  if (status === "booting") {
    return null;
  }

  if (redirect) {
    return <Navigate to={redirect} replace />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const redirect = getPublicOnlyRouteRedirect({
    isAuthenticated,
    fallbackPath: ROUTES.DASHBOARD,
  });

  if (redirect) {
    return <Navigate to={redirect} replace />;
  }

  return <Outlet />;
}
