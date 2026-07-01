import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginFeature } from "@/features/auth/login-feature";
import { DashboardFeature } from "@/features/dashboard/dashboard-feature";
import { HomeFeature } from "@/features/home/home-feature";
import { PrivateRoute, PublicOnlyRoute } from "@/routes/auth-routes";
import { ROUTES } from "@/constants";
import "@/styles/app.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomeFeature />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path={ROUTES.LOGIN} element={<LoginFeature />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardFeature />} />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
