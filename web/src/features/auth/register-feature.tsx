import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/shared/api/http";
import { ROUTES } from "@/shared/constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { RegisterPage } from "@/features/auth/ui/register-page";

import {
  createRegisterSchema,
  type RegisterFormValues,
} from "./schemas/register-schema";
import { useRegisterMutation } from "./hooks/use-register-mutation";

export function RegisterFeature() {
  const { t } = useTranslation();
  const initialize = useAuthStore((state) => state.initialize);
  const registerMutation = useRegisterMutation();
  const navigate = useNavigate();
  const registerSchema = useMemo(
    () => createRegisterSchema((key) => t(key)),
    [t],
  );

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      workspaceName: "",
      workspaceSlug: "",
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    try {
      const response = await registerMutation.mutateAsync({
        ...data,
        workspaceSlug: data.workspaceSlug.toLowerCase(),
      });

      initialize({
        accessToken: response.accessToken,
        user: response.user,
        workspaces: [response.workspace],
      });

      toast.success(t("auth.register.success"));
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        t("auth.register.errorFallback"),
      );
      toast.error(message);
    }
  }

  return (
    <RegisterPage
      form={form}
      onSubmit={onSubmit}
      isSubmitting={registerMutation.isPending}
    />
  );
}
