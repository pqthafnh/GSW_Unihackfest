import { describe, expect, it } from "vitest";
import { loginSchema, signupSchema } from "@/lib/auth/validation";

describe("authentication validation", () => {
  const base = { email: "person@example.com", password: "password123", confirmPassword: "password123", displayName: "A Person", role: "CLIENT" as const };

  it("accepts CLIENT and WORKER", () => {
    expect(signupSchema.safeParse(base).success).toBe(true);
    expect(signupSchema.safeParse({ ...base, role: "WORKER" }).success).toBe(true);
  });

  it("rejects invalid email, short password and mismatch", () => {
    expect(signupSchema.safeParse({ ...base, email: "bad" }).success).toBe(false);
    expect(signupSchema.safeParse({ ...base, password: "short", confirmPassword: "short" }).success).toBe(false);
    expect(signupSchema.safeParse({ ...base, confirmPassword: "different" }).success).toBe(false);
  });

  it("rejects ADMIN and unknown roles", () => {
    expect(signupSchema.safeParse({ ...base, role: "ADMIN" }).success).toBe(false);
    expect(signupSchema.safeParse({ ...base, role: "SUPER_ADMIN" }).success).toBe(false);
  });

  it("requires login credentials", () => {
    expect(loginSchema.safeParse({ email: "person@example.com", password: "password123" }).success).toBe(true);
    expect(loginSchema.safeParse({ email: "bad", password: "" }).success).toBe(false);
  });
});
