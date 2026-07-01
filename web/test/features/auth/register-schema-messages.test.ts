import { describe, expect, it } from "vitest";
import { createRegisterSchema } from "@/features/auth/schemas/register-schema";

describe("createRegisterSchema", () => {
  it("uses translated validation messages", () => {
    const schema = createRegisterSchema((key) => `translated:${key}`);
    const result = schema.safeParse({
      name: "",
      email: "not-an-email",
      password: "",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toEqual([
        "translated:auth.register.validation.name",
        "translated:auth.register.validation.email",
        "translated:auth.register.validation.password",
      ]);
    }
  });
});
