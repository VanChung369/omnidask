import { useNavigate, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { ROUTES } from "@/constants";
import { isApiError } from "@/lib/api";
import { useAuthStore } from "@/stores/use-auth-store";
import { LoginPage } from "@/components/pages/login-page";
import { createLoginSchema, type LoginFormValues } from "./schemas/login-schema";
import { useLoginMutation } from "./hooks/use-login-mutation";

function getLoginErrorMessage(error: unknown, fallbackMessage: string) {
  if (isApiError(error)) {
    return (
      error.response?.data.message ||
      error.response?.data.error ||
      fallbackMessage
    );
  }

  return fallbackMessage;
}

export function LoginFeature() {
  const { t } = useTranslation();
  const login = useAuthStore((state) => state.login);
  const loginMutation = useLoginMutation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || ROUTES.DASHBOARD;
  const loginSchema = useMemo(() => createLoginSchema((key) => t(key)), [t]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    try {
      const response = await loginMutation.mutateAsync(data);
      login(response);
      toast.success(t("auth.login.success"));
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message = getLoginErrorMessage(error, t("auth.login.errorFallback"));
      form.setError("root", { message });
      toast.error(message);
    }
  }

  return (
    <LoginPage
      form={form}
      onSubmit={onSubmit}
      isSubmitting={loginMutation.isPending}
    />
  );
}
