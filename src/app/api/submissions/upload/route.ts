import { NextResponse } from "next/server";
import { uploadSubmission } from "@/lib/submissions/service";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const data = await uploadSubmission(formData);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UPLOAD_FAILED";
    const status = message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 400;
    
    let userMessage = "Không thể nộp bài.";
    if (message === "UPLOAD_FAILED") userMessage = "Lỗi khi tải file lên Storage (có thể do sai định dạng, file quá lớn, hoặc chưa cấp quyền RLS).";
    else if (message === "FORBIDDEN") userMessage = "Bạn không có quyền nộp bài cho công việc này (trạng thái Gig không hợp lệ hoặc không phải là Worker được giao).";
    else if (message === "FILE_REQUIRED") userMessage = "Không tìm thấy tệp đính kèm.";
    else if (message === "INVALID_METADATA") userMessage = "Dữ liệu mô tả bài nộp không hợp lệ.";
    else if (message.startsWith("DB_ERROR: ")) userMessage = "Lỗi DB: " + message;
    
    // Fallback to exactly what the error is for debugging
    userMessage += ` (Debug code: ${message})`;

    return NextResponse.json(
      { ok: false, error: userMessage, requestId: crypto.randomUUID() },
      { status }
    );
  }
}
