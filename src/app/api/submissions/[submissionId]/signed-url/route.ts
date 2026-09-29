import { NextResponse } from "next/server";
import { signedSubmissionUrl } from "@/lib/submissions/service";
export async function GET(_: Request, { params }: { params: Promise<{ submissionId: string }> }) {
  try { const url = await signedSubmissionUrl((await params).submissionId); return NextResponse.redirect(url); }
  catch (error) { const message = error instanceof Error ? error.message : ""; return NextResponse.json({ ok: false, error: message === "NOT_FOUND" ? "Không tìm thấy bài nộp." : "Không thể tạo liên kết tải.", requestId: crypto.randomUUID() }, { status: message === "NOT_FOUND" ? 404 : 403 }); }
}
