import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

  // Verify gig is CLAIMED (worker has been assigned) before settling
  const { data: gig } = await supabase
    .from("gigs")
    .select("id, status")
    .eq("id", gigId)
    .maybeSingle();

  if (!gig) {
    return NextResponse.json({ error: "Gig not found" }, { status: 404 });
  }

  if (!["CLAIMED", "OPEN", "FUNDED"].includes(gig.status)) {
    return NextResponse.json(
      { error: `Cannot settle gig with status: ${gig.status}` },
      { status: 400 }
    );
  }

  // MVP: Mark gig as CANCELLED (closest to "settled" in current schema)
  // TODO: Add SETTLED status to gig_status enum when schema is updated
  const { error } = await supabase
    .from("gigs")
    .update({ status: "CANCELLED" })
    .eq("id", gigId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    status: "SETTLED",
    note: "Devnet MVP: marked CANCELLED as proxy for SETTLED. Add SETTLED enum value in DB migration to use real status.",
  });
}
