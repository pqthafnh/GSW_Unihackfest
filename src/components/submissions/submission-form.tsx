"use client";

import { useRef, useState, useContext, useSyncExternalStore } from "react";
import { WalletClientContext } from "@/components/providers/app-providers";

export function SubmissionForm({ gigId }: { gigId: string }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [submissionState, setSubmissionState] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const client = useContext(WalletClientContext);
  const connected = useSyncExternalStore(
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    (cb: any) => client?.wallet?.subscribe(cb) || (() => {}),
    () => client?.wallet?.getState?.()?.connected,
    () => null
  );

  async function submit(formData: FormData) {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/submissions/upload", { method: "POST", body: formData });
      const contentType = response.headers.get("content-type") ?? "";
      const result = contentType.includes("application/json")
        ? await response.json() as { ok: boolean; error?: string }
        : { ok: false, error: "Máy chủ trả về phản hồi không hợp lệ." };
      if (!response.ok || !result.ok) {
        setMessage(result.error ?? "Không thể nộp bài.");
        return;
      }
      setMessage("Đã nộp bài thành công.");
      if (!connected) setSubmissionState("PENDING_WALLET");
      formRef.current?.reset();
    } catch {
      setMessage("Không thể kết nối để nộp bài.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-4 p-3 rounded-xl bg-slate-50 border text-sm flex items-center justify-between">
        <div>
          <span className="font-semibold mr-2">Trạng thái ví Solana:</span>
          {connected ? <span className="text-green-600 font-medium">Đã kết nối</span> : <span className="text-amber-600 font-medium">Chưa kết nối (Cần kết nối ví trên Navbar để ký on-chain)</span>}
        </div>
      </div>
      <form ref={formRef} action={submit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <input type="hidden" name="gigId" value={gigId} />
      <label className="block text-sm font-medium">Tiêu đề bài nộp<input required name="submissionTitle" minLength={3} maxLength={160} className="mt-2 min-h-11 w-full rounded-xl border p-3" /></label>
      <label className="block text-sm font-medium">Tóm tắt<input required name="summary" minLength={10} maxLength={5000} className="mt-2 min-h-11 w-full rounded-xl border p-3" /></label>
      <label className="block text-sm font-medium">Ghi chú (tuỳ chọn)<textarea name="notes" maxLength={5000} className="mt-2 min-h-24 w-full rounded-xl border p-3" /></label>
      <label className="block text-sm font-medium">Tệp deliverable<input required name="file" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.zip" className="mt-2 block min-h-11 w-full rounded-xl border p-3" /></label>
      <p className="text-sm text-slate-600">Tệp được lưu trong private Storage. Tích hợp bằng chứng mã hóa băm SHA-256 xác thực trên mạng lưới Solana Devnet.</p>
      {submissionState === "PENDING_WALLET" ? <p className="text-amber-600 font-semibold mt-4">Kết nối ví để xác nhận bài nộp trên Devnet.</p> : <button disabled={busy} className="min-h-11 rounded-full bg-[#0066cc] px-5 font-semibold text-white disabled:opacity-60">{busy ? "Đang tải lên..." : "Nộp bài"}</button>}
      {message && <p role="status" className="text-sm">{message}</p>}
    </form>
    </div>
  );
}
