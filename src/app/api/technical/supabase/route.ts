import { apiSuccess } from "@/lib/api/response";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getServerSupabaseConfig } from "@/lib/supabase/config";

export async function GET() {
  const requestId = crypto.randomUUID();
  if (process.env.NODE_ENV === "production") return new Response(null, { status: 404 });

  const config = getServerSupabaseConfig();
  if (config.state !== "configured") {
    return apiSuccess({
      configured: false,
      reachable: false,
      database: "not_configured" as const,
      auth: "not_checked" as const,
      storage: "not_checked" as const,
    }, requestId);
  }

  const client = createSupabaseAdminClient();
  if (!client) {
    return apiSuccess({
      configured: true,
      reachable: false,
      database: "unreachable" as const,
      auth: "not_checked" as const,
      storage: "not_checked" as const,
    }, requestId);
  }

  try {
    const { error } = await client
      .from("system_health_checks")
      .select("id")
      .limit(1)
      .abortSignal(AbortSignal.timeout(8_000));

    if (error) {
      return apiSuccess({
        configured: true,
        reachable: false,
        database: "unreachable" as const,
        auth: "not_checked" as const,
        storage: "not_checked" as const,
      }, requestId);
    }
  } catch {
    return apiSuccess({
      configured: true,
      reachable: false,
      database: "unreachable" as const,
      auth: "not_checked" as const,
      storage: "not_checked" as const,
    }, requestId);
  }

  return apiSuccess({
    configured: true,
    reachable: true,
    database: "reachable" as const,
    auth: "not_checked" as const,
    storage: "not_checked" as const,
  }, requestId);
}
