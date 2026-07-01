import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { ROUTES } from "@/shared/constants";
import { LoginRoute } from "@/features/auth/routes/login-route";
import { DashboardFeature } from "@/features/dashboard/dashboard-feature";

import { PrivateRoute, PublicOnlyRoute } from "./guards";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path={ROUTES.LOGIN} element={<LoginRoute />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardFeature />} />
        </Route>

        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
