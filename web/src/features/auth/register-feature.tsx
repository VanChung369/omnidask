import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ROUTES } from "@/constants";
import { RegisterPage } from "@/components/pages/register-page";
import { useAuthStore } from "@/stores/use-auth-store";
import {
  registerSchema,
  type RegisterFormValues,
} from "./schemas/register-schema";

export function RegisterFeature() {
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "Demo User",
      email: "demo@omnidask.local",
      password: "password",
    },
  });

  function onSubmit(data: RegisterFormValues) {
    register(data.name, data.email);
    navigate(ROUTES.DASHBOARD, { replace: true });
  }

  return <RegisterPage form={form} onSubmit={onSubmit} />;
}
