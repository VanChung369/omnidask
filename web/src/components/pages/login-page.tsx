import { FormEvent } from "react";
import { ArrowLeft, LogIn } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/atoms/button";
import { Field, FieldGroup, FieldLabel } from "@/components/atoms/field";
import { Input } from "@/components/atoms/input";
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
            <ArrowLeft data-icon="inline-start" />
            Home
          </Link>
        </Button>

        <div className="auth-heading">
          <span className="eyebrow">Private access</span>
          <h1>Login to Omnidask</h1>
          <p>Use any email to enter the protected dashboard in this demo.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="login-email">Email</FieldLabel>
              <Input
                required
                autoComplete="email"
                defaultValue="demo@omnidask.local"
                id="login-email"
                name="email"
                type="email"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="login-password">Password</FieldLabel>
              <Input
                required
                autoComplete="current-password"
                defaultValue="password"
                id="login-password"
                name="password"
                type="password"
              />
            </Field>
          </FieldGroup>
          <Button type="submit" size="lg">
            <LogIn data-icon="inline-start" />
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
