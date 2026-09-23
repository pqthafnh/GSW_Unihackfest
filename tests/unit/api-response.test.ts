import { describe, expect, it } from "vitest";
import { apiError, apiSuccess } from "@/lib/api/response";
import { GET as healthHandler } from "@/app/api/health/route";

describe("API Response Envelope Unit Tests", () => {
  it("creates a standardized success response with requestId and ok: true", async () => {
    const data = { id: "gig-123", status: "DRAFT" };
    const res = apiSuccess(data, "req-test-1");

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({
      ok: true,
      data: { id: "gig-123", status: "DRAFT" },
      requestId: "req-test-1",
    });
  });

  it("creates a standardized error response with code, message and status", async () => {
    const res = apiError("UNAUTHORIZED", "User not logged in", undefined, 401, "req-test-2");

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json).toEqual({
      ok: false,
      error: {
        code: "UNAUTHORIZED",
        message: "User not logged in",
      },
      requestId: "req-test-2",
    });
  });

  it("includes fieldErrors when validation errors occur", async () => {
    const fieldErrors = {
      budget: ["Must be a positive integer"],
      deadline: ["Must be in the future"],
    };
    const res = apiError("VALIDATION_ERROR", "Invalid payload", fieldErrors, 422, "req-test-3");

    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.error.fieldErrors).toEqual(fieldErrors);
    expect(json.requestId).toBe("req-test-3");
  });

  it("health route returns only safe fields without secret leak", async () => {
    const res = await healthHandler();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.data.status).toBe("healthy");
    expect(json.data.configuredCluster).toBe("devnet");
    expect(typeof json.data.environment).toBe("string");
    expect(typeof json.requestId).toBe("string");
    expect(json.requestId.length).toBeGreaterThan(0);

    // Verify safe boundaries: no server secrets leaked
    expect(json.data).not.toHaveProperty("SUPABASE_SECRET_KEY");
    expect(json.data).not.toHaveProperty("AI_API_KEY");
    expect(json.data).not.toHaveProperty("METAPLEX_MINT_AUTHORITY_SECRET");
    expect(json.data).not.toHaveProperty("CRON_SECRET");
  });
});
