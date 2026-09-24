import type { SupabaseClient } from "@supabase/supabase-js";

import type { Gig } from "./types";
import type { GigInput } from "./validation";
import { normalizeTerms, parseSkills } from "./validation";

export async function listClientGigs(
  client: SupabaseClient,
  userId: string,
) {
  return client
    .from("gigs")
    .select("*,license_terms(*)")
    .eq("client_id", userId)
    .order("created_at", { ascending: false })
    .returns<Gig[]>();
}

export async function listWorkerGigs(client: SupabaseClient) {
  return client
    .from("gigs")
    .select("*,license_terms(*)")
    .in("status", ["OPEN", "CLAIMED"])
    .order("created_at", { ascending: false })
    .returns<Gig[]>();
}

function args(input: GigInput) {
  return {
    p_title: input.title,
    p_description: input.description,
    p_category: input.category,
    p_deliverables: input.deliverables,
    p_budget_atomic: input.budgetAtomic,
    p_deadline: new Date(input.deadline).toISOString(),
    p_revision_allowance: input.revisionAllowance,
    p_required_skills: parseSkills(input.requiredSkills),
    p_license_type: input.licenseType,
    p_terms_text: normalizeTerms(input.termsText),
  };
}

export async function createGig(
  client: SupabaseClient,
  input: GigInput,
) {
  const result = await client.rpc(
    "create_draft_gig_with_terms",
    args(input),
  );

  if (result.error) {
    console.error("create_draft_gig_with_terms failed", {
      code: result.error.code,
      message: result.error.message,
      details: result.error.details,
      hint: result.error.hint,
    });
  }

  return result;
}

export async function updateGig(
  client: SupabaseClient,
  id: string,
  input: GigInput,
) {
  return client.rpc("update_draft_gig", {
    p_gig_id: id,
    ...args(input),
  });
}

export async function mutateGig(
  client: SupabaseClient,
  operation:
    | "lock_gig_terms"
    | "open_gig"
    | "claim_gig"
    | "cancel_gig",
  id: string,
) {
  return client.rpc(operation, {
    p_gig_id: id,
  });
}

export async function getGig(
  client: SupabaseClient,
  id: string,
) {
  return client
    .from("gigs")
    .select("*,license_terms(*)")
    .eq("id", id)
    .maybeSingle<Gig>();
}
