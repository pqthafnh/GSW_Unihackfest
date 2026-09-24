import { z } from "zod";
import { LICENSE_TYPES } from "./types";

const atomic = z.string().regex(/^[0-9]+$/, "Nhập số nguyên dương").refine((v) => { try { const n = BigInt(v); return n > 0n && n <= 9223372036854775807n; } catch { return false; } }, "Ngân sách không hợp lệ");
export const gigInputSchema = z.object({
  title: z.string().trim().min(5).max(120), description: z.string().trim().min(20),
  category: z.string().trim().min(2).max(60), deliverables: z.string().trim().min(10),
  budgetAtomic: atomic,
  deadline: z.string().refine((value) => {
    const parsed = new Date(value);
    return !Number.isNaN(parsed.getTime()) && parsed.getTime() > Date.now();
  }, "Hạn chót phải là thời điểm hợp lệ trong tương lai"),
  revisionAllowance: z.coerce.number().int().min(0).max(10),
  requiredSkills: z.string().optional().default(""), licenseType: z.enum(LICENSE_TYPES),
  termsText: z.string().trim().min(20),
});
export type GigInput = z.infer<typeof gigInputSchema>;
export function normalizeTerms(text: string) { return text.replace(/\r\n?/g, "\n").trim(); }
export function parseSkills(value: string) { return value.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 20); }
export function formatGigErrors(error: z.ZodError) {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) fields[String(issue.path[0])] ??= issue.message;
  return fields;
}
