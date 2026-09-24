export const PROFILE_ROLES = ["CLIENT", "WORKER", "ADMIN"] as const;
export type ProfileRole = (typeof PROFILE_ROLES)[number];

export interface Profile {
  id: string;
  display_name: string;
  role: ProfileRole;
  wallet_address: string | null;
  created_at: string;
  updated_at: string;
}
