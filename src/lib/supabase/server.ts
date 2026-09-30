import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPublicSupabaseConfig } from "@/lib/supabase/config";

export async function createSupabaseServerClient() {
  const config = getPublicSupabaseConfig();
  if (config.state !== "configured" || !config.url || !config.publishableKey) return null;
  const cookieStore = await cookies();
  return createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot always mutate cookies; middleware owns refresh writes.
        }
      },
    },
  });
}

/**
 * Admin client using service role key — bypasses RLS.
 * Use ONLY in server-side API routes for privileged operations.
 * Reads SUPABASE_SECRET_KEY (or fallback aliases) from env.
 */
export function createSupabaseAdminClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL;

  // Support multiple common naming conventions for the service role key
  const serviceKey =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_ADMIN_KEY;

  if (!url) {
    throw new Error("ADMIN_CONFIG: NEXT_PUBLIC_SUPABASE_URL not set.");
  }
  if (!serviceKey) {
    throw new Error(
      "ADMIN_CONFIG: Service role key missing. Add SUPABASE_SECRET_KEY to Vercel Environment Variables " +
      "(Vercel → Project Settings → Environment Variables). " +
      "Get the value from: Supabase Dashboard → Project Settings → API → service_role key."
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

