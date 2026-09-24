import { getAuthenticatedProfile } from "@/lib/profile/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import {
  createGig,
  getGig,
  listClientGigs,
  listWorkerGigs,
  mutateGig,
  updateGig,
} from "./repository";
import type { GigInput } from "./validation";

export async function gigContext(role: "CLIENT" | "WORKER") {
  const context = await getAuthenticatedProfile();

  if (!context || context.profile.role !== role) {
    throw new Error("UNAUTHORIZED");
  }

  const client = await createSupabaseServerClient();

  if (!client) {
    throw new Error("SUPABASE_UNAVAILABLE");
  }

  return { context, client };
}

export async function readClientGigs() {
  const { context, client } = await gigContext("CLIENT");
  return listClientGigs(client, context.user.id);
}

export async function readWorkerGigs() {
  const { client } = await gigContext("WORKER");
  return listWorkerGigs(client);
}

export async function readGig(
  id: string,
  role: "CLIENT" | "WORKER",
) {
  const { client } = await gigContext(role);
  return getGig(client, id);
}

export async function createGigService(input: GigInput) {
  const { client } = await gigContext("CLIENT");
  return createGig(client, input);
}

export async function updateGigService(
  id: string,
  input: GigInput,
) {
  const { client } = await gigContext("CLIENT");
  return updateGig(client, id, input);
}

export async function mutateGigService(
  operation:
    | "lock_gig_terms"
    | "open_gig"
    | "claim_gig"
    | "cancel_gig",
  id: string,
  role: "CLIENT" | "WORKER",
) {
  const { client } = await gigContext(role);
  return mutateGig(client, operation, id);
}
