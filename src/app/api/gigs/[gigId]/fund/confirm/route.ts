import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request, { params }: { params: { gigId: string } }) {
  const { gigId } = params;
  const { signature } = await request.json();

  // In a real app, verify the transaction via RPC here.
  // MVP bypass: Check if signature exists, then mark FUNDED
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
  const { error } = await supabase
    .from("gigs")
    .update({ status: "FUNDED" })
    .eq("id", gigId)
    .eq("status", "DRAFT");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, status: "FUNDED" });
}
