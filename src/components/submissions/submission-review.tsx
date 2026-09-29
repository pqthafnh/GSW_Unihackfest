"use client";

import { useState } from "react";
import type { Submission } from "@/lib/submissions/types";

export function SubmissionReview({ submissions }: { submissions: Submission[] }) {
  const [message, setMessage] = useState("");
  async function revision(id: string) {
    const response = await fetch(`/api/submissions/${id}/revision`, { method: "POST" });
    setMessage(response.ok ? "Đã yêu cầu chỉnh sửa." : "Không thể yêu cầu chỉnh sửa.");
  }
  async function download(id: string) {
    const response = await fetch(`/api/submissions/${id}/signed-url`);
    const result = await response.json() as { data?: { url?: string } };
    if (result.data?.url) window.location.assign(result.data.url);
  }
  return <div className="space-y-4">{submissions.map((submission) => <article key={submission.id} className="rounded-2xl border border-slate-200 bg-white p-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold">{submission.submission_title}</h2><span>Phiên bản {submission.version} · {submission.status}</span></div>
    <p className="mt-2 whitespace-pre-wrap text-slate-700">{submission.summary}</p>
    {submission.notes && <p className="mt-2 text-sm text-slate-600">{submission.notes}</p>}
    <p className="mt-3 text-sm text-slate-600">{submission.original_file_name} · {submission.mime_type} · {submission.size_bytes} bytes</p>
    <div className="mt-4 flex flex-wrap gap-3"><button onClick={() => download(submission.id)} className="min-h-11 rounded-full border px-4">Tải tệp riêng tư</button>{submission.status === "SUBMITTED" && <button onClick={() => revision(submission.id)} className="min-h-11 rounded-full bg-[#0066cc] px-4 font-semibold text-white">Yêu cầu chỉnh sửa</button>}</div>
  </article>)}{message && <p role="status">{message}</p>}</div>;
}
