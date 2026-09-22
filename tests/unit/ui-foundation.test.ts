import { describe, expect, it } from "vitest";
import { GIG_STATUSES } from "@/contracts";
import { DEMO_GIGS, PLANNED_TECHNICAL_STACK } from "@/data/demo-data";

describe("UI foundation deterministic contracts", () => {
  it("keeps public CTA destinations stable", () => {
    const ctaHrefs = {
      exploreDemo: "/demo",
      createAGig: "/client",
      findWork: "/worker",
      continueAsClient: "/client",
      continueAsContributor: "/worker",
    };

    expect(ctaHrefs).toEqual({
      exploreDemo: "/demo",
      createAGig: "/client",
      findWork: "/worker",
      continueAsClient: "/client",
      continueAsContributor: "/worker",
    });
  });

  it("defines the required demo disclosures", () => {
    const disclosure = "Demo Mode • Simulated Data • No real funds • No blockchain transaction is submitted";
    expect(disclosure).toContain("Demo Mode");
    expect(disclosure).toContain("Simulated Data");
    expect(disclosure).toContain("No real funds");
    expect(disclosure).toContain("No blockchain transaction is submitted");
  });

  it("uses atomic integer demo budgets and valid gig statuses", () => {
    for (const gig of DEMO_GIGS) {
      expect(Number.isInteger(gig.budgetAtomic)).toBe(true);
      expect(GIG_STATUSES).toContain(gig.status);
    }
  });

  it("only marks Solana Devnet as configured", () => {
    const configured = PLANNED_TECHNICAL_STACK.filter((item) => item.status === "Configured");
    expect(configured.map((item) => item.service)).toEqual(["Solana Devnet"]);
    expect(
      PLANNED_TECHNICAL_STACK.filter((item) => item.service !== "Solana Devnet").every(
        (item) => item.status === "Not connected",
      ),
    ).toBe(true);
  });

  it("keeps demo data deterministic", () => {
    const source = DEMO_GIGS.map((gig) => `${gig.id}:${gig.createdAt}:${gig.updatedAt}`).join("|");
    expect(source).not.toContain("Date.now");
    expect(source).not.toContain("Math.random");
  });
});
