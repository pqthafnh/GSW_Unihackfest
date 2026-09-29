"use client";
import { useActionState, useContext, useSyncExternalStore } from "react";
import { WalletClientContext } from "@/components/providers/app-providers";
import { gigMutationAction, claimGigAction } from "@/app/actions/gigs";
export function GigAction({ gigId, operation, label }: { gigId: string; operation: "lock_gig_terms"|"open_gig"|"cancel_gig"; label: string }) { return <form action={gigMutationAction}><input type="hidden" name="gigId" value={gigId}/><input type="hidden" name="operation" value={operation}/><button className="rounded-full border border-neutral-300 bg-white px-6 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm transition-all hover:bg-neutral-50 hover:shadow-md active:scale-95 disabled:opacity-50">{label}</button></form>; }
export function ClaimGigButton({ gigId }: { gigId: string }) {
  const client = useContext(WalletClientContext);
  const connected = useSyncExternalStore(
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    (cb: any) => client?.wallet?.subscribe(cb) || (() => {}),
    () => client?.wallet?.getState?.()?.connected,
    () => null
  );
  if (!connected) {
    return <button disabled className="rounded-full bg-neutral-200 text-neutral-600 px-4 py-2 text-sm font-semibold cursor-not-allowed">Kết nối ví để tiếp tục</button>;
  }
  return <ClaimForm gigId={gigId} />;
}

function ClaimForm({ gigId }: { gigId: string }) {
  const [state, action, pending] = useActionState(claimGigAction, {});
  return <form action={action}><input type="hidden" name="gigId" value={gigId}/>{state.formError && <p className="mb-2 text-sm text-red-600">{state.formError}</p>}<button disabled={pending} className="relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] hover:scale-105 active:scale-95 disabled:opacity-70 disabled:pointer-events-none">{pending ? "Đang nhận..." : "Nhận công việc"}</button></form>;
}
