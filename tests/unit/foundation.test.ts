import { describe, expect, it } from "vitest";
import { clientEnvSchema, serverEnvSchema } from "@/lib/env";
import { cn } from "@/lib/utils";

describe("Foundation Unit Tests", () => {
  describe("Utility Helper", () => {
    it("merges tailwind class names properly", () => {
      const result = cn("p-4", "text-red-500", { "font-bold": true, "hidden": false });
      expect(result).toContain("p-4");
      expect(result).toContain("text-red-500");
      expect(result).toContain("font-bold");
      expect(result).not.toContain("hidden");
    });
  });

  describe("Environment Validation", () => {
    it("parses valid client environment defaults", () => {
      const parsed = clientEnvSchema.parse({
        NEXT_PUBLIC_SOLANA_CLUSTER: "devnet",
      });
      expect(parsed.NEXT_PUBLIC_SOLANA_CLUSTER).toBe("devnet");
    });

    it("parses valid server environment defaults", () => {
      const parsed = serverEnvSchema.parse({});
      expect(parsed.SOLANA_RPC_URL).toBe("https://api.devnet.solana.com");
      expect(parsed.PLATFORM_FEE_BPS).toBe(500);
      expect(parsed.SUPABASE_PRIVATE_BUCKET).toBe("deliverables");
    });

    it("fails validation for invalid RPC URL", () => {
      expect(() => {
        serverEnvSchema.parse({
          SOLANA_RPC_URL: "not-a-valid-url",
        });
      }).toThrow();
    });

    it("rejects out-of-range platform fee bps", () => {
      expect(() => {
        serverEnvSchema.parse({
          PLATFORM_FEE_BPS: 15000, // max 10000 bps = 100%
        });
      }).toThrow();
    });
  });

  describe("Workflow State Machine Constants", () => {
    const WORKFLOW_STATES = [
      "DRAFT",
      "TERMS_LOCKED",
      "FUNDING_PENDING",
      "FUNDED",
      "CLAIMED",
      "SUBMITTED",
      "SETTLEMENT_PENDING",
      "SETTLED",
      "RECEIPT_PENDING",
      "COMPLETED",
      "REVISION_REQUESTED",
      "CANCEL_PENDING",
      "REFUNDED",
      "DISPUTED",
      "RESOLVED_TO_CLIENT",
      "RESOLVED_TO_WORKER",
    ] as const;

    it("includes all happy path and edge states defined in docs/workflows.md", () => {
      expect(WORKFLOW_STATES).toContain("DRAFT");
      expect(WORKFLOW_STATES).toContain("TERMS_LOCKED");
      expect(WORKFLOW_STATES).toContain("FUNDED");
      expect(WORKFLOW_STATES).toContain("SETTLED");
      expect(WORKFLOW_STATES).toContain("COMPLETED");
      expect(WORKFLOW_STATES.length).toBe(16);
    });
  });
});
