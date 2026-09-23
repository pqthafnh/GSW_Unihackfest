import { createClient } from "@supabase/supabase-js";
import { getServerSupabaseConfig } from "@/lib/supabase/config";

if (typeof window !== "undefined") {
  throw new Error("Supabase admin client is server-only.");
}

export function createSupabaseAdminClient() {
  const config = getServerSupabaseConfig();
  if (config.state !== "configured" || !config.url || !config.secretKey) return null;
  return createClient(config.url, config.secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          signal: init?.signal ?? AbortSignal.timeout(8_000),
        }),
    },
  });
}
