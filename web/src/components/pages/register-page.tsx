import { FormEvent } from "react";
import { ArrowLeft, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/atoms/button";
import { useAuthStore } from "@/stores/use-auth-store";

export function RegisterPage() {
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");

    register(name, email);
    navigate("/dashboard", { replace: true });
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
          <span className="eyebrow">Public signup</span>
          <h1>Create workspace</h1>
          <p>Register moves you straight into the private dashboard route.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              required
              autoComplete="name"
              defaultValue="Demo User"
              name="name"
              type="text"
            />
          </label>
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
              autoComplete="new-password"
              defaultValue="password"
              name="password"
              type="password"
            />
          </label>
          <Button type="submit" size="lg">
            <UserPlus />
            Create account
          </Button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}
