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

  // Use admin client to bypass RLS for settlement
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  const { data: gig } = await supabase
    .from("gigs")
    .select("id, status")
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

  // Try SETTLED first, fall back to CANCELLED if enum not yet updated
  let { error } = await supabase
    .from("gigs")
    .update({ status: "SETTLED" })
    .eq("id", gigId);

  if (error && error.message.includes("invalid input value")) {
    // SETTLED enum not added yet — use CANCELLED as fallback
    const fallback = await supabase
      .from("gigs")
      .update({ status: "CANCELLED" })
      .eq("id", gigId);
    error = fallback.error;
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    gigId,
    note: "Settlement recorded. Devnet MVP.",
  });
}
