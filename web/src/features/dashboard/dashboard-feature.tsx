import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/shared/constants";
import { authService } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/auth.store";

import { DashboardPage } from "./ui/dashboard-page";

export function DashboardFeature() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await authService.logout();
    } finally {
      logout();
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }

  return <DashboardPage user={user} onLogout={handleLogout} />;
}
