# API Specification

## Envelope
Success returns `{ ok: true, data, requestId }`. Failure returns `{ ok: false, error: { code, message, fieldErrors? }, requestId }`.

## Core routes
- `POST /api/gigs`
- `GET /api/gigs/:gigId`
- `POST /api/gigs/:gigId/lock-terms`
- `POST /api/gigs/:gigId/fund`
- `POST /api/gigs/:gigId/fund/confirm`
- `POST /api/gigs/:gigId/submissions`
- `POST /api/submissions/:submissionId/review`
- `POST /api/gigs/:gigId/revision`
- `POST /api/gigs/:gigId/approve`
- `POST /api/gigs/:gigId/approve/confirm`
- `POST /api/gigs/:gigId/disputes`
- `GET /api/receipts/:assetId`
- `POST /api/submissions/upload` — authenticated WORKER multipart upload; the server derives version/path/hash.
- `GET /api/submissions/:submissionId/signed-url` — authenticated CLIENT owner or assigned WORKER; returns a five-minute private URL.
- `POST /api/submissions/:submissionId/revision` — authenticated CLIENT owner; transitions `SUBMITTED` to `REVISION_REQUESTED`.
- `POST /api/technical/solana-proof` — accepts only `{ signature }`, verifies a finalized Devnet transaction through the configured server RPC, and requires a signer plus the fixed no-value memo proof. It never updates gig/payment state.

The wallet proof route returns a request ID and safe error codes (`INVALID_SIGNATURE`,
`NOT_CONFIRMED`, `INVALID_PROOF`, `DEVNET_ONLY`, `VERIFICATION_FAILED`). Private RPC
configuration stays server-only; the browser may use only the public Devnet endpoint.

All mutations require session, authorization, Zod validation and state validation. Confirmation endpoints are idempotent and verify chain state.

## Authentication

- `POST` semantics for signup/login/logout are implemented as server actions at `src/app/actions/auth.ts`.
- `/auth/callback` exchanges a Supabase Auth code and redirects only to the authenticated profile role dashboard.
- Protected page authorization reads `auth.getUser()` and `public.profiles.role` server-side. Client state, query parameters and user metadata are not authorization sources.

## TASK-002C gig mutations

Gig mutations use Server Actions backed by the six PostgreSQL RPC operations in the forward-only Phase C migration: create draft with version-one terms, update draft, lock terms, open, claim and cancel. The authenticated actor is taken from the session/RPC `auth.uid()`; clients never submit owner, worker, role or status fields. Claim uses a conditional atomic update and maps a lost race to a conflict.

## TASK-002D submission mutations

Submission upload validates metadata and file bytes on the server, uses a generated
object path, and computes SHA-256 from the uploaded bytes. Storage upload precedes
the database RPC, so a failed metadata insert triggers compensating object removal.
The database determines the next version under an advisory transaction lock.
Signed URLs are short-lived and are never stored. The migration and Storage
policies have not been applied to hosted Supabase.
