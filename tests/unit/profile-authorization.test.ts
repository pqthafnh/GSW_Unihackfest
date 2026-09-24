import { describe, expect, it } from "vitest";
import { isRoleAuthorized } from "@/lib/profile/authorization";

describe("profile role authorization", () => {
  it("allows matching roles only", () => {
    expect(isRoleAuthorized("CLIENT", "CLIENT")).toBe(true);
    expect(isRoleAuthorized("WORKER", "WORKER")).toBe(true);
    expect(isRoleAuthorized("CLIENT", "WORKER")).toBe(false);
    expect(isRoleAuthorized("WORKER", "CLIENT")).toBe(false);
    expect(isRoleAuthorized("ADMIN", "CLIENT")).toBe(false);
    expect(isRoleAuthorized(undefined, "CLIENT")).toBe(false);
  });
});
