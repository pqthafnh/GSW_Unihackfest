import { describe, expect, it } from "vitest";
import { canTransition, isClaimConflict } from "@/lib/gigs/state";
import { gigInputSchema, normalizeTerms } from "@/lib/gigs/validation";
describe("TASK-002C gig domain", () => {
  it("normalizes terms line endings and trims", () => expect(normalizeTerms("  a\r\nb\r c  ")).toBe("a\nb\n c"));
  it("accepts atomic integer budget and rejects decimals", () => {
    const base = { title:"Một công việc", description:"Mô tả đủ dài cho công việc này", category:"Game", deliverables:"Bàn giao tệp hoàn chỉnh", budgetAtomic:"10", deadline:"2026-10-01T10:00:00+00:00", revisionAllowance:"1", requiredSkills:"", licenseType:"EXCLUSIVE", termsText:"Điều khoản sử dụng đủ dài ở đây" };
    expect(gigInputSchema.safeParse(base).success).toBe(true);
    expect(gigInputSchema.safeParse({...base,budgetAtomic:"1.2"}).success).toBe(false);
  });
  it("allows only phase C transitions", () => { expect(canTransition("DRAFT","TERMS_LOCKED")).toBe(true); expect(canTransition("CLAIMED","OPEN")).toBe(false); });
  it("maps atomic claim conflicts safely", () => expect(isClaimConflict("GIG_ALREADY_CLAIMED")).toBe(true));
});
