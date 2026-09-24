import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getPublicSupabaseConfig } from "@/lib/supabase/config";

export async function middleware(request: NextRequest) {
  const config = getPublicSupabaseConfig();
  if (config.state !== "configured" || !config.url || !config.publishableKey) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const client = createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  await client.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/client/:path*", "/worker/:path*", "/admin/:path*"],
};
