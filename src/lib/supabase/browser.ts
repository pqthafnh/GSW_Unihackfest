import { createBrowserClient } from "@supabase/ssr";
import { getPublicSupabaseConfig } from "@/lib/supabase/config";

export function createSupabaseBrowserClient() {
  const config = getPublicSupabaseConfig();
  if (config.state !== "configured" || !config.url || !config.publishableKey) return null;
  return createBrowserClient(config.url, config.publishableKey);
}
