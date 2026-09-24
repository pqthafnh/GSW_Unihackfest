import type { GigStatus } from "./types";
const transitions: Record<GigStatus, GigStatus[]> = {
  DRAFT: ["TERMS_LOCKED", "CANCELLED"], TERMS_LOCKED: ["OPEN", "CANCELLED"],
  OPEN: ["CLAIMED", "CANCELLED"], CLAIMED: [], CANCELLED: [],
};
export function canTransition(from: GigStatus, to: GigStatus) { return transitions[from].includes(to); }
export function isClaimConflict(message: string) { return message.includes("GIG_ALREADY_CLAIMED") || message.includes("duplicate"); }
export const CLAIM_CONFLICT_MESSAGE = "Công việc đã có Cộng tác viên nhận";
