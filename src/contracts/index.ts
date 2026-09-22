/**
 * Domain and API contracts for Micro-Gig Network.
 */

export const GIG_STATUSES = [
  "DRAFT",
  "TERMS_LOCKED",
  "FUNDING_PENDING",
  "FUNDED",
  "CLAIMED",
  "SUBMITTED",
  "SETTLEMENT_PENDING",
  "SETTLED",
  "RECEIPT_PENDING",
  "COMPLETED",
  "REVISION_REQUESTED",
  "CANCEL_PENDING",
  "REFUNDED",
  "DISPUTED",
  "RESOLVED_TO_CLIENT",
  "RESOLVED_TO_WORKER",
] as const;

export type GigStatus = (typeof GIG_STATUSES)[number];

export const LICENSE_TYPES = [
  "EXCLUSIVE",
  "NON_EXCLUSIVE",
  "COMMERCIAL_GAMING",
  "REVOCABLE_PILOT",
] as const;

export type LicenseType = (typeof LICENSE_TYPES)[number];

export interface CreateGigInput {
  title: string;
  brief: string;
  budgetAtomic: number; // Atomic integer, never float
  deadline: string;
  licenseType: LicenseType;
}

export interface GigRecord {
  id: string;
  clientId: string;
  workerId?: string | null;
  title: string;
  brief: string;
  budgetAtomic: number;
  deadline: string;
  status: GigStatus;
  licenseType: LicenseType;
  termsHash?: string | null;
  escrowPda?: string | null;
  createdAt: string;
  updatedAt: string;
}
