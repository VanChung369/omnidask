import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/constants";
import { DashboardPage } from "@/components/pages/dashboard-page";
import { useAuthStore } from "@/stores/use-auth-store";

export function DashboardFeature() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate(ROUTES.HOME, { replace: true });
  }

  return <DashboardPage user={user} onLogout={handleLogout} />;
}
