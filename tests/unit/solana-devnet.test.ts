import {
  canTransition,
  explorerTransactionUrl,
  isValidAddress,
  isValidSignature,
  mapVerificationError,
  mapWalletError,
  shortenAddress,
} from "@/lib/solana/devnet";
import { describe, expect, it } from "vitest";

describe("Devnet wallet proof helpers", () => {
  it("locks Explorer links to Devnet and validates signatures", () => {
    const signature = "5".repeat(88);
    expect(isValidSignature(signature)).toBe(true);
    expect(explorerTransactionUrl(signature)).toBe(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    expect(() => explorerTransactionUrl("not-a-signature")).toThrow();
  });

  it("shortens valid addresses without changing short values", () => {
    const address = "11111111111111111111111111111111";
    expect(isValidAddress(address)).toBe(true);
    expect(shortenAddress(address)).toBe("1111…1111");
    expect(shortenAddress("abc")).toBe("abc");
  });

  it("allows only valid lifecycle transitions", () => {
    expect(canTransition("ready", "waiting")).toBe(true);
    expect(canTransition("waiting", "confirmed")).toBe(false);
    expect(canTransition("confirming", "confirmed")).toBe(true);
    expect(canTransition("confirming", "unknown")).toBe(true);
  });

  it("maps rejected and RPC failures to safe Vietnamese messages", () => {
    expect(mapWalletError(new Error("User rejected request")).state).toBe("rejected");
    expect(mapWalletError(new Error("RPC timeout")).message).toContain("Devnet RPC");
    expect(mapVerificationError("INVALID_PROOF")).toContain("bằng chứng");
  });
});
