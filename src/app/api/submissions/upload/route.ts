import { NextResponse } from "next/server";
import { uploadSubmission } from "@/lib/submissions/service";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try { return NextResponse.json({ ok: true, data: await uploadSubmission(await request.formData()) }); }
  catch (error) {
    const message = error instanceof Error ? error.message : "UPLOAD_FAILED";
    const status = message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 400;
    return NextResponse.json({ ok: false, error: "Không thể nộp bài.", requestId: crypto.randomUUID() }, { status });
  }
}
