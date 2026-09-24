import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthenticatedProfile } from "@/lib/profile/server";
import { safeRoleRedirect } from "@/lib/auth/redirect";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const client = await createSupabaseServerClient();
  if (!code || !client) return NextResponse.redirect(new URL("/dang-nhap", url.origin));
  const { error } = await client.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL("/dang-nhap", url.origin));
  const context = await getAuthenticatedProfile();
  if (!context || context.profile.role === "ADMIN") return NextResponse.redirect(new URL("/", url.origin));
  return NextResponse.redirect(new URL(safeRoleRedirect(context.profile.role, null), url.origin));
}
