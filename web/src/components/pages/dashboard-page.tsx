import { FolderKanban, LogOut, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/atoms/button";
import { useAuthStore } from "@/stores/use-auth-store";

const stats = [
  { label: "Open tasks", value: "24" },
  { label: "Queued reviews", value: "8" },
  { label: "Protected route", value: "on" },
];

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <main className="dashboard-page">
      <aside className="dashboard-sidebar">
        <Link className="brand" to="/">
          Omnidask
        </Link>
        <nav aria-label="Dashboard navigation">
          <a href="#overview">
            <FolderKanban />
            Overview
          </a>
          <a href="#security">
            <ShieldCheck />
            Route guard
          </a>
        </nav>
      </aside>

      <section className="dashboard-main" id="overview">
        <header className="dashboard-header">
          <div>
            <span className="eyebrow">Private dashboard</span>
            <h1>Welcome back, {user?.name ?? "User"}</h1>
            <p>{user?.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut />
            Logout
          </Button>
        </header>

        <div className="stats-grid">
          {stats.map((item) => (
            <article className="stat-card" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>

        <section className="guard-panel" id="security">
          <div>
            <ShieldCheck />
            <h2>Private route is active</h2>
          </div>
          <p>
            Logging out clears the auth store. Visiting <code>/dashboard</code>{" "}
            after that redirects back to <code>/login</code> with a return path.
          </p>
        </section>
      </section>
    </main>
  );
}
