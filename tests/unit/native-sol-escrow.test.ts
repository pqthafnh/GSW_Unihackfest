import { describe, expect, it } from "vitest";
import {
  calculateFee,
  calculatePayout,
  deterministicTermsHash,
  deterministicTermsPayload,
  estimateDebit,
  formatLamports,
  gigDigest,
  parseLamports,
} from "@/lib/escrow/native-sol";

describe("native SOL escrow utilities", () => {
  it("round-trips atomic lamports without floating point", () => {
    expect(parseLamports("1500000000")).toBe(1_500_000_000n);
    expect(formatLamports(1_500_000_000n)).toBe("1.5");
    expect(() => parseLamports("1.2")).toThrow();
  });

  it("calculates bounded fee and payout", () => {
    expect(calculateFee(1_000_000n, 500)).toBe(50_000n);
    expect(calculatePayout(1_000_000n, 500)).toBe(950_000n);
    expect(() => calculateFee(1n, 1_001)).toThrow();
    expect(estimateDebit(1_000n, 5_000n, 2_000n)).toBe(8_000n);
    expect(() => estimateDebit(1_000n, -1n)).toThrow();
  });

  it("hashes canonical terms and gig identity deterministically", async () => {
    expect(deterministicTermsPayload({ z: true, a: "x" })).toBe("a=x\nz=true");
    expect(await deterministicTermsHash({ z: true, a: "x" })).toBe(await deterministicTermsHash({ a: "x", z: true }));
    expect(await gigDigest("550e8400-e29b-41d4-a716-446655440000")).toBe(
      await gigDigest("550E8400-E29B-41D4-A716-446655440000"),
    );
    expect(() => gigDigest("gig-1")).toThrow();
  });
});
