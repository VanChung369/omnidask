import { describe, expect, it } from "vitest";
import { createLoginSchema } from "@/features/auth/schemas/login-schema";

describe("createLoginSchema", () => {
  it("uses translated validation messages", () => {
    const schema = createLoginSchema((key) => `translated:${key}`);
    const result = schema.safeParse({
      email: "not-an-email",
      password: "",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toEqual([
        "translated:auth.login.validation.email",
        "translated:auth.login.validation.password",
      ]);
    }
  });
});
