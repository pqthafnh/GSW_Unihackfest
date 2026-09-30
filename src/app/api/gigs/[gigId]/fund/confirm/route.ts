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

  // Verify gig exists and is in a fundable state
  const { data: gig } = await supabase
    .from("gigs")
    .select("id, status")
    .eq("id", gigId)
    .maybeSingle();

  if (!gig) {
    return NextResponse.json({ error: "Gig not found" }, { status: 404 });
  }

  // Only allow funding from TERMS_LOCKED or OPEN status
  if (!["TERMS_LOCKED", "OPEN", "DRAFT"].includes(gig.status)) {
    return NextResponse.json(
      { error: `Cannot fund gig with status: ${gig.status}` },
      { status: 400 }
    );
  }

  // MVP: Transition to OPEN (means funded and ready for workers)
  const { error } = await supabase
    .from("gigs")
    .update({ status: "OPEN" })
    .eq("id", gigId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    status: "OPEN",
    note: "Devnet MVP: gig is now OPEN (funded). Workers can now apply.",
  });
}
