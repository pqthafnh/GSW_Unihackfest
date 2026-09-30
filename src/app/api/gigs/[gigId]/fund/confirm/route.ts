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
    .select("id, status")
    .eq("id", gigId)
    .maybeSingle();

  if (!gig) {
    return NextResponse.json({ error: "Gig not found" }, { status: 404 });
  }

  // Transition gig to OPEN (publicly fundable/open for applications)
  const { error } = await supabase
    .from("gigs")
    .update({ status: "OPEN" })
    .eq("id", gigId)
    .in("status", ["TERMS_LOCKED", "DRAFT", "CLAIMED"]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    gigId,
    status: "OPEN",
    note: "Gig funded and opened. Workers can now apply. Devnet MVP.",
  });
}
