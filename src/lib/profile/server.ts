import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/profile/types";
import { isRoleAuthorized } from "@/lib/profile/authorization";

export async function getAuthenticatedProfile(): Promise<{ user: { id: string; email?: string }; profile: Profile } | null> {
  const client = await createSupabaseServerClient();
  if (!client) return null;
  const { data: { user } } = await client.auth.getUser();
  if (!user) return null;
  const { data: profile } = await client.from("profiles").select("*").eq("id", user.id).single<Profile>();
  if (!profile) return null;
  return { user: { id: user.id, email: user.email }, profile };
}

export async function requireProfileRole(role: "CLIENT" | "WORKER") {
  const context = await getAuthenticatedProfile();
  if (!context) redirect(`/dang-nhap?next=${encodeURIComponent(`/${role === "CLIENT" ? "client" : "worker"}`)}`);
  if (!isRoleAuthorized(context.profile.role, role)) redirect("/");
  return context;
}
