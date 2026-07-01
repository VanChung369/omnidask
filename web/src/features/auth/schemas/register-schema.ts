import * as z from "zod";

type Translate = (key: string) => string;

export function createRegisterSchema(t: Translate) {
  return z.object({
    name: z.string().min(1, {
      message: t("auth.register.validation.name"),
    }),
    email: z.string().email({
      message: t("auth.register.validation.email"),
    }),
    password: z.string().min(1, {
      message: t("auth.register.validation.password"),
    }),
  });
}

export const registerSchema = createRegisterSchema((key) => key);

export type RegisterFormValues = z.infer<
  ReturnType<typeof createRegisterSchema>
>;
