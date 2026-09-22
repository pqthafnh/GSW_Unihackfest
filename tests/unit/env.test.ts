import { describe, expect, it } from "vitest";
import { clientEnvSchema, serverEnvSchema, validateClientEnv, validateServerEnv } from "@/lib/env";

describe("Environment Schema Validation Unit Tests", () => {
  describe("Client Environment", () => {
    it("parses valid client environment defaults", () => {
      const parsed = clientEnvSchema.parse({
        NEXT_PUBLIC_SOLANA_CLUSTER: "devnet",
      });
      expect(parsed.NEXT_PUBLIC_SOLANA_CLUSTER).toBe("devnet");
    });

    it("rejects non-enum clusters", () => {
      expect(() => {
        clientEnvSchema.parse({
          NEXT_PUBLIC_SOLANA_CLUSTER: "localnet",
        });
      }).toThrow();
    });

    it("validates Supabase URL format if provided", () => {
      const valid = clientEnvSchema.parse({
        NEXT_PUBLIC_SUPABASE_URL: "https://xyzcompany.supabase.co",
      });
      expect(valid.NEXT_PUBLIC_SUPABASE_URL).toBe("https://xyzcompany.supabase.co");

      expect(() => {
        clientEnvSchema.parse({
          NEXT_PUBLIC_SUPABASE_URL: "not-a-url",
        });
      }).toThrow();
    });
  });

  describe("Server Environment", () => {
    it("parses server environment defaults properly", () => {
      const parsed = serverEnvSchema.parse({});
      expect(parsed.SOLANA_RPC_URL).toBe("https://api.devnet.solana.com");
      expect(parsed.PLATFORM_FEE_BPS).toBe(500);
      expect(parsed.MAX_UPLOAD_BYTES).toBe(5242880);
      expect(parsed.SUPABASE_PRIVATE_BUCKET).toBe("deliverables");
    });

    it("validates platform fee bounds [0, 10000]", () => {
      expect(() => {
        serverEnvSchema.parse({ PLATFORM_FEE_BPS: -1 });
      }).toThrow();

      expect(() => {
        serverEnvSchema.parse({ PLATFORM_FEE_BPS: 10001 });
      }).toThrow();

      const valid = serverEnvSchema.parse({ PLATFORM_FEE_BPS: "250" });
      expect(valid.PLATFORM_FEE_BPS).toBe(250);
    });

    it("coerces numeric string for max upload bytes", () => {
      const valid = serverEnvSchema.parse({ MAX_UPLOAD_BYTES: "10485760" });
      expect(valid.MAX_UPLOAD_BYTES).toBe(10485760);
    });
  });
});
