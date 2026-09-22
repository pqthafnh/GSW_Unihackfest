import { z } from "zod";

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("Invalid Supabase URL").optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SOLANA_CLUSTER: z.enum(["devnet", "testnet", "mainnet-beta"]).default("devnet"),
  NEXT_PUBLIC_ESCROW_PROGRAM_ID: z.string().min(1).optional(),
});

export const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  SOLANA_RPC_URL: z.string().url().default("https://api.devnet.solana.com"),
  SOLANA_WS_URL: z.string().default("wss://api.devnet.solana.com"),
  AI_API_KEY: z.string().optional(),
  AI_MODEL: z.string().optional(),
  METAPLEX_MINT_AUTHORITY_SECRET: z.string().optional(),
  RECEIPT_METADATA_BASE_URL: z.string().url().optional(),
  CRON_SECRET: z.string().optional(),
  PLATFORM_FEE_BPS: z.coerce.number().int().min(0).max(10000).default(500),
  ACCEPTED_TOKEN_MINT: z.string().optional(),
  MAX_UPLOAD_BYTES: z.coerce.number().int().positive().default(5242880),
  SUPABASE_PRIVATE_BUCKET: z.string().default("deliverables"),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function validateClientEnv(env: Record<string, unknown> = process.env): ClientEnv {
  const result = clientEnvSchema.safeParse(env);
  if (!result.success) {
    console.error("Invalid client environment variables:", result.error.format());
    throw new Error("Client environment validation failed");
  }
  return result.data;
}

export function validateServerEnv(env: Record<string, unknown> = process.env): ServerEnv {
  const result = serverEnvSchema.safeParse(env);
  if (!result.success) {
    console.error("Invalid server environment variables:", result.error.format());
    throw new Error("Server environment validation failed");
  }
  return result.data;
}
