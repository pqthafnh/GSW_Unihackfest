import { describe, expect, it } from "vitest";
import { safeRoleRedirect } from "@/lib/auth/redirect";

describe("role-safe redirects", () => {
  it("allows only dashboard paths for the matching role", () => {
    expect(safeRoleRedirect("CLIENT", "/client")).toBe("/client");
    expect(safeRoleRedirect("CLIENT", "/worker")).toBe("/client");
    expect(safeRoleRedirect("WORKER", "/client")).toBe("/worker");
  });

  it("rejects external, protocol-relative and encoded targets", () => {
    expect(safeRoleRedirect("CLIENT", "https://evil.example")).toBe("/client");
    expect(safeRoleRedirect("CLIENT", "//evil.example")).toBe("/client");
    expect(safeRoleRedirect("CLIENT", "/client%2F..%2Fworker")).toBe("/client");
  });
});
