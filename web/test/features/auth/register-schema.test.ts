import { describe, expect, it } from "vitest";
import { registerSchema } from "@/features/auth/schemas/register-schema";

describe("registerSchema", () => {
  it("accepts a valid registration payload", () => {
    const result = registerSchema.safeParse({
      name: "Demo User",
      email: "demo@omnidask.local",
      password: "password",
    });

    expect(result.success).toBe(true);
  });

  it("requires name, email, and password", () => {
    const result = registerSchema.safeParse({
      name: "",
      email: "not-an-email",
      password: "",
    });

    expect(result.success).toBe(false);
  });
});
