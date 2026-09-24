import type { ProfileRole } from "@/lib/profile/types";

const rolePaths: Record<ProfileRole, string> = {
  CLIENT: "/client",
  WORKER: "/worker",
  ADMIN: "/",
};

export function dashboardPathForRole(role: ProfileRole): string {
  return rolePaths[role];
}

export function safeRoleRedirect(role: ProfileRole, next: string | null | undefined): string {
  const fallback = dashboardPathForRole(role);
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\") || next.includes("%")) return fallback;
  if (role === "CLIENT" && next.startsWith("/client")) return next;
  if (role === "WORKER" && next.startsWith("/worker")) return next;
  return fallback;
}
