import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/technical/supabase/route";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Supabase diagnostic response", () => {
  it("returns safe not-configured status", async () => {
    const original = {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      publishable: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      secret: process.env.SUPABASE_SECRET_KEY,
    };
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    delete process.env.SUPABASE_SECRET_KEY;

    const response = await GET();
    const body = await response.json();
    expect(body.data).toMatchObject({
      configured: false,
      reachable: false,
      database: "not_configured",
      auth: "not_checked",
      storage: "not_checked",
    });
    expect(JSON.stringify(body)).not.toContain("secret");

    if (original.url === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = original.url;
    if (original.publishable === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    else process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = original.publishable;
    if (original.secret === undefined) delete process.env.SUPABASE_SECRET_KEY;
    else process.env.SUPABASE_SECRET_KEY = original.secret;
  });

  it("uses an eight-second abort signal for the database query", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/app/api/technical/supabase/route.ts"),
      "utf8",
    );
    expect(source).toContain(".abortSignal(AbortSignal.timeout(8_000))");
  });
});
