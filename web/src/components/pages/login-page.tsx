import { ArrowLeft, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  isSubmitting?: boolean;
}

export function LoginPage<T extends FieldValues>({
  form,
  onSubmit,
  isSubmitting = false,
}: LoginPageProps<T>) {
  const { t } = useTranslation();
  const rootError = form.formState.errors.root?.message;

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <Button asChild variant="ghost" className="back-link">
          <Link to={ROUTES.HOME}>
            <ArrowLeft data-icon="inline-start" />
            {t("common.home")}
          </Link>
        </Button>

        <div className="auth-heading">
          <span className="eyebrow">{t("auth.login.eyebrow")}</span>
          <h1>{t("auth.login.title")}</h1>
          <p>{t("auth.login.description")}</p>
        </div>

        <RHFForm form={form} onSubmit={onSubmit} className="auth-form">
          <FieldGroup>
            <RHFInput
              name="email"
              label={t("auth.login.emailLabel")}
              type="email"
              autoComplete="email"
            />
            <RHFPasswordInput
              name="password"
              label={t("auth.login.passwordLabel")}
              autoComplete="current-password"
              showPasswordLabel={t("auth.password.show")}
              hidePasswordLabel={t("auth.password.hide")}
            />
          </FieldGroup>
          {rootError && <p className="auth-form-error">{rootError}</p>}
          <Button type="submit" size="lg" disabled={isSubmitting}>
            <LogIn data-icon="inline-start" />
            {isSubmitting ? t("auth.login.submitting") : t("common.login")}
          </Button>
        </RHFForm>

        <p className="auth-switch">
          {t("auth.login.newWorkspace")}{" "}
          <Link to={ROUTES.REGISTER}>{t("auth.login.createAccount")}</Link>
        </p>
      </section>
    </main>
  );
}
