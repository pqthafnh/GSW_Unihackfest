# TASK-002D: Private Storage and Submissions

## Entry conditions

Start only after TASK-002C is applied, runtime/RLS/concurrency verified, and committed. TASK-002D requires separate approval and a separate migration.

## Mandatory reading

Read project rules, database/API/feature skills, complete TASK-002 specification, TASK-002C migration and implementation, current docs, source, tests, environment example, and Storage-related configuration. Do not read or print `.env.local`.

## Scope

Implement:

- private Storage bucket;
- `public.submissions`;
- submission versions;
- private server-generated object paths;
- MIME and file-size validation;
- content SHA-256 from real bytes;
- upload compensation cleanup;
- short-lived signed URLs;
- submission RLS and Storage policies;
- CLIENT review access;
- revision request foundation;
- Vietnamese UI and tests.

Out of scope: AI review, approval/payment/settlement, blockchain, Anchor, Metaplex, receipts, public URLs, disputes, chat, and notifications.

## Schema

Create `public.submissions`:

```text
id uuid primary key default gen_random_uuid()
gig_id uuid not null references public.gigs(id) on delete restrict
worker_id uuid not null references public.profiles(id) on delete restrict
version integer not null
submission_title text not null
summary text not null
object_path text not null
original_file_name text not null
mime_type text not null
size_bytes bigint not null
content_hash text not null
notes text null
status text not null default 'SUBMITTED'
submitted_at timestamptz not null default now()
created_at timestamptz not null default now()
```

Statuses are `SUBMITTED` and `REVISION_REQUESTED` only.

Constraints:

- unique `(gig_id, version)`;
- version > 0;
- worker must be the assigned worker;
- gig must be CLAIMED;
- meaningful title/summary length constraints;
- nonempty object path and original filename;
- MIME allowlist;
- size > 0 and <= `MAX_UPLOAD_BYTES`;
- lowercase SHA-256 hex, 64 characters;
- browser does not provide worker ID, version, object path, or hash;
- no user-facing hard delete.

## Versioning and revision

Version one is the first submission. The database determines the next version. A new version is allowed only after the current submission is `REVISION_REQUESTED`. Preserve history.

CLIENT owner may request revision only for a `SUBMITTED` submission. Do not implement APPROVED, payment, or settlement.

## Storage bucket

Bucket name comes from `SUPABASE_PRIVATE_BUCKET`, default `deliverables`. The bucket must be private. Never create public URLs.

Server-generated object path:

```text
gigs/<gig_id>/submissions/<submission_id>/<safe_file_name>
```

Do not include email. Do not accept a browser-selected path. Sanitize filenames, reject path traversal, normalize unsafe characters, and preserve only an approved extension strategy.

## Upload flow and compensation

1. Verify session.
2. Require WORKER role.
3. Verify assignment and gig state.
4. Validate metadata, MIME, and size.
5. Generate submission ID and object path server-side.
6. Compute SHA-256 from real file bytes.
7. Upload to the private bucket.
8. Insert submission metadata.
9. If DB insert fails after upload, remove the object.
10. If upload fails, do not create completed metadata.
11. Surface cleanup failure safely without hiding the original failure.

Storage and PostgreSQL are not one transaction. Implement and document the compensation boundary.

## Signed URL flow

Only the gig's CLIENT owner and assigned WORKER may request a short-lived signed URL. The server retrieves `object_path` from the database, never from request input. Do not log or persist signed URLs. Do not return secrets.

If a privileged server operation is needed to generate the URL, authorization must happen first and may not be bypassed.

## RLS and Storage policies

- anonymous and unrelated users have no access;
- CLIENT reads submissions for owned gigs;
- WORKER reads owned submissions;
- WORKER creates submissions only when assigned and gig state permits;
- users cannot arbitrarily update status or delete submissions;
- Storage upload/read policies or authorized server operations must enforce the same relationship rules;
- no public bucket or broad policy.

## Architecture

Use Server Components for reads. Use Server Actions or a controlled Route Handler for upload where file/runtime limits require it. Keep validation, authorization, service, repository, Storage client, and compensation logic separated. Do not use client-provided identity or path.

## Routes/UI

- `/worker/cong-viec/[gigId]/nop-bai`
- `/client/cong-viec/[gigId]/bai-nop`

Vietnamese UI must show submission title, summary, notes, file, version, private-file disclosure, status, download action, and revision request. Clearly disclose test environment, private Storage, no real money, no blockchain transaction, no on-chain escrow, and hash not on-chain.

## Migration

Create exactly one new forward-only migration:

`supabase/migrations/<timestamp>_create_private_storage_and_submissions.sql`

Do not modify prior migrations. The migration may create the private bucket and policies only if the SQL is explicit, reviewable, idempotent where appropriate, and safe. Do not apply it during implementation.

## Tests

Pure unit tests for metadata schema, MIME allowlist, size limit, safe filename, path generation, traversal rejection, byte hash, versioning, revision transition, authorization, signed URL authorization, compensation outcomes, and safe errors/results.

Do not add dependencies, jsdom, Testing Library, or fake integration tests without separate approval.

## Verification

Run lint, typecheck, tests, and build sequentially. Do not login/link/push/apply Supabase. Stop for SQL and Storage-policy review.

## Required response before implementation

First response only: audit current Phase C state, propose schema/constraints/RLS/Storage policies/upload and cleanup architecture/signed URLs/routes/UI/files/migration/tests/acceptance criteria, then stop for approval. Do not modify the repository before approval.
