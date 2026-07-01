import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, LayoutDashboard, LogIn } from "lucide-react";

import { Button } from "@/components/atoms/button";
import { ROUTES } from "@/constants";

type HomePageProps = {
  isAuthenticated: boolean;
};

export function HomePage({ isAuthenticated }: HomePageProps) {
  const { t } = useTranslation();

  return (
    <main className="public-page">
      <nav className="site-nav">
        <Link className="brand" to={ROUTES.HOME}>
          {t("common.appName")}
        </Link>
        <div className="nav-actions">
          <Button asChild variant="ghost">
            <Link to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN}>
              {isAuthenticated ? (
                <LayoutDashboard data-icon="inline-start" />
              ) : (
                <LogIn data-icon="inline-start" />
              )}
              {isAuthenticated ? t("common.dashboard") : t("common.login")}
            </Link>
          </Button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">{t("common.appName")}</span>
          <h1>{t("home.heroTitle")}</h1>
          <p>{t("home.heroDescription")}</p>
          <div className="hero-actions">
            <Button asChild size="lg">
              <Link to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN}>
                {isAuthenticated
                  ? t("home.openDashboard")
                  : t("common.login")}
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="route-preview" aria-label={t("home.routesLabel")}>
          <div>
            <span>{t("home.publicRoute")}</span>
            <strong>{ROUTES.LOGIN}</strong>
          </div>
          <div>
            <span>{t("home.privateRoute")}</span>
            <strong>{ROUTES.DASHBOARD}</strong>
          </div>
        </div>
      </section>
    </main>
  );
}
