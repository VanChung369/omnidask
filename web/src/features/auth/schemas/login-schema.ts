import * as z from "zod";

type Translate = (key: string) => string;

export function createLoginSchema(t: Translate) {
  return z.object({
    email: z.string().email({ message: t("auth.login.validation.email") }),
    password: z.string().min(1, {
      message: t("auth.login.validation.password"),
    }),
  });
}

export const loginSchema = createLoginSchema((key) => key);

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
