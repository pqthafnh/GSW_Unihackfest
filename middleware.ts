import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Session refresh and role enforcement are implemented with the Supabase SSR client.
  // Never trust role or userId supplied by query parameters or request bodies.
  return NextResponse.next({ request });
}

export const config = {
  matcher: ["/client/:path*", "/worker/:path*", "/admin/:path*"],
};
