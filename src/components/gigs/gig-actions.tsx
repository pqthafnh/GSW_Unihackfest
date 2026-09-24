"use client";
import { useActionState } from "react";
import { gigMutationAction, claimGigAction } from "@/app/actions/gigs";
export function GigAction({ gigId, operation, label }: { gigId: string; operation: "lock_gig_terms"|"open_gig"|"cancel_gig"; label: string }) { return <form action={gigMutationAction}><input type="hidden" name="gigId" value={gigId}/><input type="hidden" name="operation" value={operation}/><button className="rounded-full border px-4 py-2 text-sm font-semibold">{label}</button></form>; }
export function ClaimGigButton({ gigId }: { gigId: string }) {
  return <ClaimForm gigId={gigId} />;
}

function ClaimForm({ gigId }: { gigId: string }) {
  const [state, action, pending] = useActionState(claimGigAction, {});
  return <form action={action}><input type="hidden" name="gigId" value={gigId}/>{state.formError && <p className="mb-2 text-sm text-red-600">{state.formError}</p>}<button disabled={pending} className="rounded-full bg-[#0066cc] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{pending ? "Đang nhận..." : "Nhận công việc"}</button></form>;
}
