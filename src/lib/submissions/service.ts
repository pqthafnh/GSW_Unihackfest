import { randomUUID } from "node:crypto";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { validateServerEnv } from "@/lib/env";
import { objectPath, safeFileName, sha256, submissionMetadataSchema, validateFile } from "./validation";
import type { Submission } from "./types";

async function context(role: "CLIENT" | "WORKER" | "PARTICIPANT") {
  const client = await createSupabaseServerClient(); if (!client) throw new Error("NOT_CONFIGURED");
  const { data: { user } } = await client.auth.getUser(); if (!user) throw new Error("UNAUTHORIZED");
  const { data: profile } = await client.from("profiles").select("role").eq("id", user.id).single();
  if (role !== "PARTICIPANT" && profile?.role !== role) throw new Error("FORBIDDEN");
  return { client, user };
}
export async function uploadSubmission(formData: FormData) {
  const { client, user } = await context("WORKER");
  const gigId = String(formData.get("gigId") || "");
  const metadata = submissionMetadataSchema.safeParse({ submissionTitle: formData.get("submissionTitle"), summary: formData.get("summary"), notes: formData.get("notes") || undefined });
  if (!metadata.success) throw new Error("INVALID_METADATA");
  const file = formData.get("file"); if (!(file instanceof File)) throw new Error("FILE_REQUIRED");
  const max = validateServerEnv().MAX_UPLOAD_BYTES; validateFile(file, max);
  const { data: gig } = await client.from("gigs").select("id,status,assigned_worker_id").eq("id", gigId).maybeSingle();
  if (!gig || gig.status !== "CLAIMED" || gig.assigned_worker_id !== user.id) throw new Error("FORBIDDEN");
  const id = randomUUID(); const name = safeFileName(file.name); const path = objectPath(gigId, id, name);
  const bytes = new Uint8Array(await file.arrayBuffer()); const hash = sha256(bytes);
  const uploaded = await client.storage.from(validateServerEnv().SUPABASE_PRIVATE_BUCKET).upload(path, bytes, { contentType: file.type, upsert: false });
  if (uploaded.error) throw new Error("UPLOAD_FAILED");
  const { data, error } = await client.rpc("create_submission", {
    p_gig_id: gigId,
    p_submission_title: metadata.data.submissionTitle,
    p_summary: metadata.data.summary,
    p_object_path: path,
    p_original_file_name: name,
    p_mime_type: file.type,
    p_size_bytes: bytes.byteLength,
    p_sha256: hash,
    p_notes: metadata.data.notes ?? null,
  }).returns<Submission>();
  if (error) { await client.storage.from(validateServerEnv().SUPABASE_PRIVATE_BUCKET).remove([path]); throw new Error("DB_ERROR: " + error.message); }
  return data;
}
export async function signedSubmissionUrl(submissionId: string) {
  const { client } = await context("PARTICIPANT");
  const { data: submission } = await client.from("submissions").select("*").eq("id", submissionId).single<Submission>();
  if (!submission) throw new Error("NOT_FOUND");
  const { data, error } = await client.storage.from(validateServerEnv().SUPABASE_PRIVATE_BUCKET).createSignedUrl(submission.object_path, 300);
  if (error || !data?.signedUrl) throw new Error("SIGNED_URL_FAILED"); return data.signedUrl;
}
export async function requestRevision(submissionId: string) {
  const { client } = await context("CLIENT");
  const { data, error } = await client.rpc("request_submission_revision", { p_submission_id: submissionId }).returns<Submission>();
  if (error || !data) throw new Error("REVISION_REQUEST_FAILED"); return data;
}

export async function listGigSubmissions(gigId: string) {
  const { client } = await context("PARTICIPANT");
  const { data, error } = await client.from("submissions").select("*").eq("gig_id", gigId).order("version", { ascending: false }).returns<Submission[]>();
  if (error) throw new Error("SUBMISSIONS_READ_FAILED");
  return data;
}
