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
        : { ok: false, error: "MÃ¡y chá»§ tráº£ vá» pháº£n há»“i khÃ´ng há»£p lá»‡." };
      if (!response.ok || !result.ok) {
        setMessage(result.error ?? "KhÃ´ng thá»ƒ ná»™p bÃ i.");
        return;
      }
      setMessage("ÄÃ£ ná»™p bÃ i thÃ nh cÃ´ng.");
      if (!connected) setSubmissionState("PENDING_WALLET");
      formRef.current?.reset();
    } catch {
      setMessage("KhÃ´ng thá»ƒ káº¿t ná»‘i Ä‘á»ƒ ná»™p bÃ i.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-4 p-3 rounded-xl bg-slate-50 border text-sm flex items-center justify-between">
        <div>
          <span className="font-semibold mr-2">Tráº¡ng thÃ¡i vÃ­ Solana:</span>
          {connected ? <span className="text-green-600 font-medium">ÄÃ£ káº¿t ná»‘i</span> : <span className="text-amber-600 font-medium">ChÆ°a káº¿t ná»‘i (Cáº§n káº¿t ná»‘i vÃ­ trÃªn Navbar Ä‘á»ƒ kÃ½ on-chain)</span>}
        </div>
      </div>
      <form ref={formRef} action={submit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <input type="hidden" name="gigId" value={gigId} />
      <label className="block text-sm font-medium">TiÃªu Ä‘á» bÃ i ná»™p<input required name="submissionTitle" minLength={3} maxLength={160} className="mt-2 min-h-11 w-full rounded-xl border p-3" /></label>
      <label className="block text-sm font-medium">TÃ³m táº¯t<input required name="summary" minLength={10} maxLength={5000} className="mt-2 min-h-11 w-full rounded-xl border p-3" /></label>
      <label className="block text-sm font-medium">Ghi chÃº (tuá»³ chá»n)<textarea name="notes" maxLength={5000} className="mt-2 min-h-24 w-full rounded-xl border p-3" /></label>
      <label className="block text-sm font-medium">Tá»‡p deliverable<input required name="file" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.zip" className="mt-2 block min-h-11 w-full rounded-xl border p-3" /></label>
      <p className="text-sm text-slate-600">Tá»‡p Ä‘Æ°á»£c lÆ°u trong private Storage. TÃ­ch há»£p báº±ng chá»©ng mÃ£ hÃ³a bÄƒm SHA-256 xÃ¡c thá»±c trÃªn máº¡ng lÆ°á»›i Solana Devnet.</p>
      {submissionState === "PENDING_WALLET" ? <p className="text-amber-600 font-semibold mt-4">Káº¿t ná»‘i vÃ­ Ä‘á»ƒ xÃ¡c nháº­n bÃ i ná»™p trÃªn Devnet.</p> : <button disabled={busy} className="min-h-11 rounded-full bg-[#0066cc] px-5 font-semibold text-white disabled:opacity-60">{busy ? "Äang táº£i lÃªn..." : "Ná»™p bÃ i"}</button>}
      {message && <p role="status" className="text-sm">{message}</p>}
    </form>
    </div>
  );
}
