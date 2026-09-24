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

All mutations require session, authorization, Zod validation and state validation. Confirmation endpoints are idempotent and verify chain state.

## Authentication

- `POST` semantics for signup/login/logout are implemented as server actions at `src/app/actions/auth.ts`.
- `/auth/callback` exchanges a Supabase Auth code and redirects only to the authenticated profile role dashboard.
- Protected page authorization reads `auth.getUser()` and `public.profiles.role` server-side. Client state, query parameters and user metadata are not authorization sources.

## TASK-002C gig mutations

Gig mutations use Server Actions backed by the six PostgreSQL RPC operations in the forward-only Phase C migration: create draft with version-one terms, update draft, lock terms, open, claim and cancel. The authenticated actor is taken from the session/RPC `auth.uid()`; clients never submit owner, worker, role or status fields. Claim uses a conditional atomic update and maps a lost race to a conflict.
