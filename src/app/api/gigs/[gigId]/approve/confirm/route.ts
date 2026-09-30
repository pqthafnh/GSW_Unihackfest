import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ gigId: string }> }
) {
  const { gigId } = await params;
  const body = await request.json().catch(() => ({}));
  const signature = body?.signature;

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let supabase;
  try {
    supabase = createSupabaseAdminClient();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Admin client error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const { data: gig } = await supabase
    .from("gigs")
    .select("id, status, assigned_worker_id")
    .eq("id", gigId)
    .maybeSingle();

  if (!gig) {
    return NextResponse.json({ error: "Gig not found" }, { status: 404 });
  }

  const settleableStatuses = ["CLAIMED", "OPEN", "FUNDED", "TERMS_LOCKED"];
  if (!settleableStatuses.includes(gig.status)) {
    return NextResponse.json(
      { error: `Cannot settle gig with status: ${gig.status}` },
      { status: 400 }
    );
  }

  // The DB constraint gigs_claimed_has_worker enforces:
  //   (status = 'CLAIMED') = (assigned_worker_id IS NOT NULL)
  // So when transitioning OUT of CLAIMED, we must clear assigned_worker_id
  // at the same time as changing status (or do it first).
  //
  // Strategy: null out assigned_worker_id first (status stays CLAIMED → OK),
  // then update status to CANCELLED (no worker → OK).
  // This satisfies the constraint at every step.

  if (gig.assigned_worker_id) {
    // Step 1: Record the worker for the response before clearing
    const workerId = gig.assigned_worker_id;

    // Step 2: Null out worker while keeping status CLAIMED temporarily is not
    // possible (constraint is bidirectional). We must update BOTH in one statement.
    const { error: settleError } = await supabase
      .from("gigs")
      .update({
        status: "CANCELLED",
        assigned_worker_id: null,
      })
      .eq("id", gigId);

    if (settleError) {
      return NextResponse.json({ error: settleError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      gigId,
      workerId,
      note: "Settlement recorded. Gig marked as CANCELLED (proxy for SETTLED until SETTLED enum is added). Worker payment approved. Devnet MVP.",
    });
  }

  // If no worker (OPEN/TERMS_LOCKED state), just cancel
  const { error } = await supabase
    .from("gigs")
    .update({ status: "CANCELLED" })
    .eq("id", gigId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    gigId,
    note: "Gig settled. Devnet MVP.",
  });
}
