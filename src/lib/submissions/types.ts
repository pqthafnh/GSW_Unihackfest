export type SubmissionStatus = "SUBMITTED" | "REVISION_REQUESTED";
export interface Submission {
  id: string; gig_id: string; worker_id: string; version: number;
  submission_title: string; summary: string; object_path: string;
  bucket_id: string; original_file_name: string; mime_type: string;
  size_bytes: number; sha256: string; notes: string | null;
  status: SubmissionStatus; submitted_at: string; created_at: string;
  updated_at: string;
}
