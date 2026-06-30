import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ROUTES } from "@/constants";
import { useAuthStore } from "@/stores/use-auth-store";
import { LoginPage } from "@/components/pages/login-page";
import { loginSchema, type LoginFormValues } from "./schemas/login-schema";

export function LoginFeature() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || ROUTES.DASHBOARD;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "demo@omnidask.local",
      password: "password",
    },
  });

  function onSubmit(data: LoginFormValues) {
    login(data.email);
    navigate(redirectTo, { replace: true });
  }

  return <LoginPage form={form} onSubmit={onSubmit} />;
}
