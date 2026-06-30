import { FormEvent } from "react";
import { ArrowLeft, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/atoms/button";
import { Field, FieldGroup, FieldLabel } from "@/components/atoms/field";
import { Input } from "@/components/atoms/input";
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
            <ArrowLeft data-icon="inline-start" />
            Home
          </Link>
        </Button>

        <div className="auth-heading">
          <span className="eyebrow">Public signup</span>
          <h1>Create workspace</h1>
          <p>Register moves you straight into the private dashboard route.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="register-name">Name</FieldLabel>
              <Input
                required
                autoComplete="name"
                defaultValue="Demo User"
                id="register-name"
                name="name"
                type="text"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="register-email">Email</FieldLabel>
              <Input
                required
                autoComplete="email"
                defaultValue="demo@omnidask.local"
                id="register-email"
                name="email"
                type="email"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="register-password">Password</FieldLabel>
              <Input
                required
                autoComplete="new-password"
                defaultValue="password"
                id="register-password"
                name="password"
                type="password"
              />
            </Field>
          </FieldGroup>
          <Button type="submit" size="lg">
            <UserPlus data-icon="inline-start" />
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
