import * as z from "zod";

type Translate = (key: string) => string;

export function createRegisterSchema(t: Translate) {
  return z.object({
    displayName: z.string().min(2, {
      message: t("auth.register.validation.displayName"),
    }).max(100, {
      message: t("auth.register.validation.displayName"),
    }),
    email: z.string().email({
      message: t("auth.register.validation.email"),
    }),
    password: z.string().min(12, {
      message: t("auth.register.validation.password"),
    }),
    workspaceName: z.string().min(2, {
      message: t("auth.register.validation.workspaceName"),
    }).max(100, {
      message: t("auth.register.validation.workspaceName"),
    }),
    workspaceSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: t("auth.register.validation.workspaceSlug"),
    }),
  });
}

export const registerSchema = createRegisterSchema((key) => key);

export type RegisterFormValues = z.infer<
  ReturnType<typeof createRegisterSchema>
>;
