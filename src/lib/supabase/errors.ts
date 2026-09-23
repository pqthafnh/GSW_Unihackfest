export type SupabaseDomainErrorCode = "UNREACHABLE" | "SCHEMA_NOT_READY";

export class SupabaseDomainError extends Error {
  constructor(public readonly code: SupabaseDomainErrorCode, message: string) {
    super(message);
    this.name = "SupabaseDomainError";
  }
}

export function mapSupabaseError(error: unknown): SupabaseDomainError {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("relation") && message.includes("does not exist")) {
    return new SupabaseDomainError("SCHEMA_NOT_READY", "Technical schema is not available yet.");
  }
  return new SupabaseDomainError("UNREACHABLE", "Supabase database could not be reached.");
}
