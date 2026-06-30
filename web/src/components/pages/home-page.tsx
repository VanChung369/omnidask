import { ArrowRight, LayoutDashboard, LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/atoms/button";
import { useAuthStore } from "@/stores/use-auth-store";

export function HomePage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <main className="public-page">
      <nav className="site-nav" aria-label="Main navigation">
        <Link className="brand" to="/">
          Omnidask
        </Link>
        <div className="nav-actions">
          {isAuthenticated ? (
            <Button asChild>
              <Link to="/dashboard">
                <LayoutDashboard />
                Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">
                  <ArrowRight />
                  Start
                </Link>
              </Button>
            </>
          )}
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Task operations workspace</span>
          <h1>Omnidask keeps team work visible from the first route.</h1>
          <p>
            Public pages stay open for discovery and sign-in, while the dashboard
            is protected behind a private route guard.
          </p>
          <div className="hero-actions">
            <Button asChild size="lg">
              <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                <ArrowRight />
                {isAuthenticated ? "Open dashboard" : "Create workspace"}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login">
                <LockKeyhole />
                Private route demo
              </Link>
            </Button>
          </div>
        </div>

        <div className="route-preview" aria-label="Route groups">
          <div>
            <span>Public</span>
            <strong>/</strong>
            <strong>/login</strong>
            <strong>/register</strong>
          </div>
          <div>
            <span>Private</span>
            <strong>/dashboard</strong>
          </div>
        </div>
      </section>
    </main>
  );
}
