import { ArrowLeft, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import {
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form";

import { ROUTES } from "@/constants";
import { Button } from "@/components/atoms/button";
import { FieldGroup } from "@/components/atoms/field";
import { RHFForm, RHFInput, RHFPasswordInput } from "@/components/molecules";

interface LoginPageProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
}

export function LoginPage<T extends FieldValues>({
  form,
  onSubmit,
}: LoginPageProps<T>) {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <Button asChild variant="ghost" className="back-link">
          <Link to={ROUTES.HOME}>
            <ArrowLeft data-icon="inline-start" />
            Home
          </Link>
        </Button>

        <div className="auth-heading">
          <span className="eyebrow">Private access</span>
          <h1>Login to Omnidask</h1>
          <p>Use any email to enter the protected dashboard in this demo.</p>
        </div>

        <RHFForm form={form} onSubmit={onSubmit} className="auth-form">
          <FieldGroup>
            <RHFInput
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
            />
            <RHFPasswordInput
              name="password"
              label="Password"
              autoComplete="current-password"
            />
          </FieldGroup>
          <Button type="submit" size="lg">
            <LogIn data-icon="inline-start" />
            Login
          </Button>
        </RHFForm>

        <p className="auth-switch">
          New workspace? <Link to={ROUTES.REGISTER}>Create an account</Link>
        </p>
      </section>
    </main>
  );
}
