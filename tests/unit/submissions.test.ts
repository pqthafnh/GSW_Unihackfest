import { describe, expect, it } from "vitest";
import { objectPath, safeFileName, sha256, validateFile } from "@/lib/submissions/validation";
describe("submission primitives", () => {
  it("hashes bytes and creates server path", () => { expect(sha256(new TextEncoder().encode("abc"))).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"); expect(objectPath("g","s","a.pdf")).toBe("gigs/g/submissions/s/a.pdf"); });
  it("rejects traversal and invalid files", () => { expect(() => safeFileName("../x.pdf")).toThrow(); expect(() => validateFile({ type: "application/pdf", size: 0 }, 10)).toThrow(); expect(() => validateFile({ type: "application/pdf", size: 11 }, 10)).toThrow(); });
  it("sanitizes display names and MIME", () => { expect(safeFileName("bản đồ.pdf")).toBe("b_n___.pdf"); expect(() => validateFile({ type: "text/html", size: 1 }, 10)).toThrow(); });
});
