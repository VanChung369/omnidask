import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form";

import { ROUTES } from "@/shared/constants";
import { Button } from "@/shared/ui/atoms/button";
import { FieldGroup } from "@/shared/ui/atoms/field";
import { RHFForm } from "@/shared/ui/molecules/rhf-form";
import { RHFInput } from "@/shared/ui/molecules/rhf-input";
import { RHFPasswordInput } from "@/shared/ui/molecules/rhf-password-input";

interface RegisterPageProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  isSubmitting?: boolean;
}

export function RegisterPage<T extends FieldValues>({
  form,
  onSubmit,
  isSubmitting = false,
}: RegisterPageProps<T>) {
  const { t } = useTranslation();

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-heading">
          <span className="eyebrow">{t("auth.register.eyebrow")}</span>
          <h1>{t("auth.register.title")}</h1>
          <p>{t("auth.register.description")}</p>
        </div>

        <RHFForm form={form} onSubmit={onSubmit} className="auth-form">
          <FieldGroup>
            <RHFInput
              name="displayName"
              label={t("auth.register.displayNameLabel")}
              autoComplete="name"
            />
            <RHFInput
              name="email"
              label={t("auth.register.emailLabel")}
              type="email"
              autoComplete="email"
            />
            <RHFPasswordInput
              name="password"
              label={t("auth.register.passwordLabel")}
              autoComplete="new-password"
              showPasswordLabel={t("auth.password.show")}
              hidePasswordLabel={t("auth.password.hide")}
            />
            <RHFInput
              name="workspaceName"
              label={t("auth.register.workspaceNameLabel")}
              autoComplete="organization"
            />
            <RHFInput
              name="workspaceSlug"
              label={t("auth.register.workspaceSlugLabel")}
              autoCapitalize="none"
              autoComplete="off"
            />
          </FieldGroup>
          <Button type="submit" size="lg" disabled={isSubmitting}>
            <UserPlus data-icon="inline-start" />
            {isSubmitting
              ? t("auth.register.submitting")
              : t("auth.register.submit")}
          </Button>
        </RHFForm>

        <p className="auth-switch">
          {t("auth.register.hasAccount")}{" "}
          <Link to={ROUTES.LOGIN}>{t("common.login")}</Link>
        </p>
      </section>
    </main>
  );
}
