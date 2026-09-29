import { describe, expect, it, vi, beforeEach } from "vitest";
import { gigContext, GigServiceError } from "@/lib/gigs/service";
import * as profileServer from "@/lib/profile/server";
import * as supabaseServer from "@/lib/supabase/server";

vi.mock("@/lib/profile/server", () => ({
  getAuthenticatedProfile: vi.fn(),
  requireProfileRole: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(),
}));

describe("Worker Workflow & Auth Guards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("gigContext", () => {
    it("throws AUTH_REQUIRED when no session", async () => {
      vi.mocked(profileServer.getAuthenticatedProfile).mockResolvedValue(null);
      await expect(gigContext("WORKER")).rejects.toThrowError(new GigServiceError("AUTH_REQUIRED"));
    });

    it("throws ROLE_FORBIDDEN when role mismatches", async () => {
      vi.mocked(profileServer.getAuthenticatedProfile).mockResolvedValue({
        user: { id: "1" },
        profile: { id: "1", wallet_address: null, created_at: "", updated_at: "", role: "CLIENT", display_name: "C" },
      });
      await expect(gigContext("WORKER")).rejects.toThrowError(new GigServiceError("ROLE_FORBIDDEN"));
    });

    it("returns context when valid", async () => {
      const mockContext = {
        user: { id: "1" },
        profile: { id: "1", wallet_address: null, created_at: "", updated_at: "", role: "WORKER" as const, display_name: "W" },
      };
      vi.mocked(profileServer.getAuthenticatedProfile).mockResolvedValue(mockContext);
      vi.mocked(supabaseServer.createSupabaseServerClient).mockResolvedValue({} as any);

      const result = await gigContext("WORKER");
      expect(result.context).toEqual(mockContext);
    });
  });
});
