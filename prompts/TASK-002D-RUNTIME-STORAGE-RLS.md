# TASK-002D: Hosted Migration, Storage, RLS, and Runtime Verification

## Entry conditions

Start only after TASK-002D code and static verification pass, the SQL and Storage policies are reviewed, and the user explicitly approves hosted changes.

## Safety

Do not print `.env.local`, keys, tokens, cookies, signed URLs, or raw provider errors. Never create a public bucket or public URL. Do not start later blockchain/payment tasks.

## Migration and bucket review

Before applying:

- summarize the migration filename;
- list submission schema, constraints, indexes, RLS, functions, bucket configuration, and Storage policies;
- confirm prior migrations are unchanged;
- reject broad public/authenticated access, path trust from clients, arbitrary status updates, or missing relationship checks.

Do not autonomously login/link/push. Provide exact instructions and wait if hosted action was not explicitly approved.

## Hosted verification

After application, verify:

- submissions table and constraints;
- RLS enabled;
- private bucket exists and is not public;
- Storage policies match actor/gig relationships;
- no public URLs;
- versioning and revision transition objects/functions exist;
- grants are minimal.

## Runtime accounts

Use a real CLIENT owner, assigned WORKER, unrelated WORKER, and anonymous browser/session. Do not commit credentials.

## Upload tests

Assigned WORKER:

1. Upload an allowed file under size limit.
2. Confirm server-generated path format.
3. Confirm version one and metadata.
4. Confirm SHA-256 matches actual bytes.
5. Confirm private object cannot be fetched anonymously.

Negative tests:

- unassigned WORKER rejected;
- unrelated CLIENT rejected;
- invalid MIME rejected;
- oversized file rejected;
- traversal filename rejected or sanitized safely;
- browser-provided path ignored/rejected;
- invalid gig state rejected.

## Compensation tests

Exercise controlled failure scenarios where feasible:

- upload failure creates no completed metadata;
- DB insert failure after upload removes the object;
- cleanup failure is reported safely and does not expose credentials or object URLs.

Do not claim compensation PASS unless observed.

## Access and signed URLs

- CLIENT owner can list/read submission metadata and obtain a short-lived signed URL;
- assigned WORKER can access own submission;
- unrelated users and anonymous users are denied;
- signed URL expires as configured;
- object path comes from the database;
- signed URL is not logged or stored.

## Versioning and revision

- first submission is version one;
- CLIENT owner requests revision from SUBMITTED;
- next version is allowed only after revision request;
- database determines next version;
- history remains readable only to related actors.

## Completion

Run lint, typecheck, tests, and build after corrections. Update docs only with verified status. Report PASS/FAIL/SKIP for bucket privacy, RLS, upload, hash, access, signed URLs, compensation, versioning, and revision. Stop before blockchain/payment tasks. Do not commit unless requested.
