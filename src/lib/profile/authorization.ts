import type { ProfileRole } from "@/lib/profile/types";

export function isRoleAuthorized(profileRole: ProfileRole | undefined, requiredRole: "CLIENT" | "WORKER"): boolean {
  return profileRole === requiredRole;
}
