export const GIG_STATUSES = [
  "DRAFT",
  "TERMS_LOCKED",
  "OPEN",
  "CLAIMED",
  "CANCELLED",
] as const;

export type GigStatus = (typeof GIG_STATUSES)[number];

export const LICENSE_TYPES = [
  "NON_EXCLUSIVE",
  "EXCLUSIVE",
  "LIMITED_USE",
] as const;

export type LicenseType = (typeof LICENSE_TYPES)[number];

export interface Gig {
  id: string;
  client_id: string;
  assigned_worker_id: string | null;
  title: string;
  description: string;
  category: string;
  deliverables: string;
  budget_atomic: string;
  token_mint: null;
  deadline: string;
  revision_allowance: number;
  required_skills: string[];
  status: GigStatus;
  created_at: string;
  updated_at: string;
  license_terms?: LicenseTerms | LicenseTerms[] | null;
}

export interface LicenseTerms {
  id: string;
  gig_id: string;
  version: number;
  license_type: LicenseType;
  terms_text: string;
  terms_hash: string | null;
  locked_at: string | null;
  created_at: string;
}
