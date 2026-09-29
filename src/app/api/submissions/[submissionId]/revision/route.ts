import { NextResponse } from "next/server";
import { requestRevision } from "@/lib/submissions/service";
export async function POST(_: Request, { params }: { params: Promise<{ submissionId: string }> }) {
  try { return NextResponse.json({ ok: true, data: await requestRevision((await params).submissionId) }); }
  catch { return NextResponse.json({ ok: false, error: "Không thể yêu cầu chỉnh sửa.", requestId: crypto.randomUUID() }, { status: 403 }); }
}
