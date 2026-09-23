import { describe, expect, it } from "vitest";
import { mapSupabaseError } from "@/lib/supabase/errors";

describe("Supabase safe errors", () => {
  it("maps provider errors to safe domain errors", () => {
    const result = mapSupabaseError(new Error("secret-token=abc"));
    expect(result.code).toBe("UNREACHABLE");
    expect(result.message).toBe("Supabase database could not be reached.");
    expect(result.message).not.toContain("abc");
  });
});
