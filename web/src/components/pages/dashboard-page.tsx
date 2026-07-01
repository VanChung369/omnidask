import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Inbox, LayoutDashboard, LogOut } from "lucide-react";

import { Button } from "@/components/atoms/button";
import { ROUTES } from "@/constants";
import type { AuthUser } from "@/types/auth";

type DashboardPageProps = {
  user: AuthUser | null;
  onLogout: () => void;
};

export function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const { t } = useTranslation();
  const displayName =
    user?.displayName || user?.email || t("dashboard.fallbackUser");

  return (
    <main className="dashboard-page">
      <aside className="dashboard-sidebar">
        <Link className="brand" to={ROUTES.DASHBOARD}>
          {t("common.appName")}
        </Link>
        <nav aria-label={t("dashboard.navLabel")}>
          <Link to={ROUTES.DASHBOARD}>
            <LayoutDashboard data-icon="inline-start" />
            {t("common.dashboard")}
          </Link>
        </nav>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <span className="eyebrow">{t("dashboard.eyebrow")}</span>
            <h1>{t("dashboard.welcome", { name: displayName })}</h1>
            <p>{t("dashboard.description")}</p>
          </div>
          <Button type="button" variant="outline" onClick={onLogout}>
            <LogOut data-icon="inline-start" />
            {t("common.logout")}
          </Button>
        </header>

        <div className="guard-panel">
          <div>
            <Inbox data-icon="inline-start" />
            <h2>{t("dashboard.authenticatedArea")}</h2>
          </div>
          <p>{t("dashboard.authenticatedDescription")}</p>
        </div>
      </section>
    </main>
  );
}
