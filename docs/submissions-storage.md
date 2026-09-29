# Private submissions (TASK-002D)

Submissions are stored in the private `deliverables` bucket (or the
`SUPABASE_PRIVATE_BUCKET` runtime value). Workers upload through the server
route; the server validates metadata, MIME, size and filename, computes
SHA-256 from the actual bytes, generates the object path, and inserts metadata.
If the insert fails, it compensates by removing the uploaded object. Storage
and PostgreSQL are separate systems, so a cleanup failure is logged safely and
the original operation remains failed.

Only the assigned worker may upload. The client owner and assigned worker may
read a submission after server-side participant authorization. Download links
are five-minute signed URLs and are never persisted. Versions are generated
from database history and a new version requires `REVISION_REQUESTED`.

The migration is forward-only and intentionally has not been applied to a
hosted project. Submission metadata stores `bucket_id`, `object_path`, and
the lowercase `sha256` digest separately. The migration’s SQL policies use the default `deliverables`
bucket; deployments using a different bucket name must apply equivalent
policies for that configured name. Files, hashes and metadata are not
on-chain; this MVP uses no real money or blockchain escrow.
