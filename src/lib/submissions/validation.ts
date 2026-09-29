import { z } from "zod";
import { createHash } from "node:crypto";

export const ALLOWED_MIME_TYPES = ["application/pdf","image/png","image/jpeg","image/webp","text/plain","application/zip"] as const;
export const submissionMetadataSchema = z.object({
  submissionTitle: z.string().trim().min(3).max(160),
  summary: z.string().trim().min(10).max(5000),
  notes: z.string().trim().max(5000).optional(),
});
export function safeFileName(input: string) {
  if (!input || input.includes("/") || input.includes("\\") || input.includes("..") || /[\0-\x1f]/.test(input)) throw new Error("INVALID_FILENAME");
  const base = input.normalize("NFKC").replace(/[^a-zA-Z0-9._-]/g, "_").replace(/^\.+/, "").slice(0, 120);
  if (!base || base === "." || base === "..") throw new Error("INVALID_FILENAME");
  return base;
}
export function validateFile(file: { type: string; size: number }, maxBytes: number) {
  if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(file.type)) throw new Error("UNSUPPORTED_MIME");
  if (file.size <= 0 || file.size > maxBytes) throw new Error("INVALID_FILE_SIZE");
}
export function objectPath(gigId: string, submissionId: string, fileName: string) {
  return `gigs/${gigId}/submissions/${submissionId}/${safeFileName(fileName)}`;
}
export function sha256(bytes: Uint8Array) { return createHash("sha256").update(bytes).digest("hex"); }
