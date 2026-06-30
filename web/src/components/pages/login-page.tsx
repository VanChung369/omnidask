import { FormEvent } from "react";
import { ArrowLeft, LogIn } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/atoms/button";
import { useAuthStore } from "@/stores/use-auth-store";

export function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");

    login(email);
    navigate(redirectTo, { replace: true });
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <Button asChild variant="ghost" className="back-link">
          <Link to="/">
            <ArrowLeft />
            Home
          </Link>
        </Button>

        <div className="auth-heading">
          <span className="eyebrow">Private access</span>
          <h1>Login to Omnidask</h1>
          <p>Use any email to enter the protected dashboard in this demo.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              required
              autoComplete="email"
              defaultValue="demo@omnidask.local"
              name="email"
              type="email"
            />
          </label>
          <label>
            Password
            <input
              required
              autoComplete="current-password"
              defaultValue="password"
              name="password"
              type="password"
            />
          </label>
          <Button type="submit" size="lg">
            <LogIn />
            Login
          </Button>
        </form>

        <p className="auth-switch">
          New workspace? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}
