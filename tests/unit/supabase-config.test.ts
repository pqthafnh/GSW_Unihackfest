import { describe, expect, it } from "vitest";
import { getPublicSupabaseConfig, getServerSupabaseConfig } from "@/lib/supabase/config";

describe("Supabase configuration", () => {
  it("separates public and server-only configuration", () => {
    const env = {
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "publishable",
      SUPABASE_SECRET_KEY: "secret",
    };
    expect(getPublicSupabaseConfig(env)).toEqual({
      state: "configured",
      url: env.NEXT_PUBLIC_SUPABASE_URL,
      publishableKey: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    });
    expect(getServerSupabaseConfig(env).secretKey).toBe("secret");
    expect(getPublicSupabaseConfig(env)).not.toHaveProperty("secretKey");
  });

  it("returns missing for empty configuration", () => {
    expect(getServerSupabaseConfig({
      NEXT_PUBLIC_SUPABASE_URL: "",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "",
      SUPABASE_SECRET_KEY: "",
    }).state).toBe("missing");
  });

  it("returns invalid for an invalid public URL", () => {
    expect(getPublicSupabaseConfig({
      NEXT_PUBLIC_SUPABASE_URL: "not-a-url",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "publishable",
    }).state).toBe("invalid");
  });
});
