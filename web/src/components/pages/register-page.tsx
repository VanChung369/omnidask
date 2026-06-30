import { ArrowLeft, UserPlus } from "lucide-react";
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

interface RegisterPageProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
}

export function RegisterPage<T extends FieldValues>({
  form,
  onSubmit,
}: RegisterPageProps<T>) {
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
          <span className="eyebrow">Public signup</span>
          <h1>Create workspace</h1>
          <p>Register moves you straight into the private dashboard route.</p>
        </div>

        <RHFForm form={form} onSubmit={onSubmit} className="auth-form">
          <FieldGroup>
            <RHFInput name="name" label="Name" autoComplete="name" />
            <RHFInput
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
            />
            <RHFPasswordInput
              name="password"
              label="Password"
              autoComplete="new-password"
            />
          </FieldGroup>
          <Button type="submit" size="lg">
            <UserPlus data-icon="inline-start" />
            Create account
          </Button>
        </RHFForm>

        <p className="auth-switch">
          Already have an account? <Link to={ROUTES.LOGIN}>Login</Link>
        </p>
      </section>
    </main>
  );
}
