import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage } from "@/components/pages/dashboard-page";
import { HomePage } from "@/components/pages/home-page";
import { LoginFeature } from "@/features/auth/login-feature";
import { RegisterPage } from "@/components/pages/register-page";
import { PrivateRoute, PublicOnlyRoute } from "@/routes/auth-routes";
import { ROUTES } from "@/constants";
import "@/styles/app.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path={ROUTES.LOGIN} element={<LoginFeature />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
