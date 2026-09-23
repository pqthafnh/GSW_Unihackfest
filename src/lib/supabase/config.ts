import { clientEnvSchema, serverEnvSchema } from "@/lib/env";

export type SupabaseConfigState = "missing" | "invalid" | "configured";

export interface PublicSupabaseConfig {
  state: SupabaseConfigState;
  url?: string;
  publishableKey?: string;
}

export interface ServerSupabaseConfig extends PublicSupabaseConfig {
  secretKey?: string;
}

export function getPublicSupabaseConfig(env: Record<string, unknown> = process.env): PublicSupabaseConfig {
  const result = clientEnvSchema.safeParse(env);
  if (!result.success) return { state: "invalid" };
  const { NEXT_PUBLIC_SUPABASE_URL: url, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: publishableKey } = result.data;
  if (!url || !publishableKey) return { state: "missing" };
  return { state: "configured", url, publishableKey };
}

export function getServerSupabaseConfig(env: Record<string, unknown> = process.env): ServerSupabaseConfig {
  const publicConfig = getPublicSupabaseConfig(env);
  const result = serverEnvSchema.safeParse(env);
  if (!result.success) return { ...publicConfig, state: "invalid" };
  const secretKey = result.data.SUPABASE_SECRET_KEY;
  if (publicConfig.state !== "configured" || !secretKey) {
    return { ...publicConfig, state: publicConfig.state === "invalid" ? "invalid" : "missing" };
  }
  return { ...publicConfig, state: "configured", secretKey };
}
