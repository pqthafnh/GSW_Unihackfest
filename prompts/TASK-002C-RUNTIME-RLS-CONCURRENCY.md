# TASK-002C: Hosted Migration, Runtime, RLS, and Concurrency Verification

## Entry conditions

Start only after:

- TASK-002C SQL review is approved;
- the migration has a timestamped filename;
- lint, typecheck, unit tests, and build pass;
- the user explicitly approves applying the migration.

## Safety

Do not read or print `.env.local`. Do not expose secrets, access tokens, refresh tokens, cookies, SQL internals, or raw provider errors. Do not start TASK-002D.

## Phase 1: Migration review and apply plan

Before any hosted action:

1. Print the migration filename only.
2. Summarize tables, triggers, RLS, policies, RPC signatures, grants, and extensions.
3. Confirm old migrations are unchanged.
4. Stop if destructive SQL, broad grants, `USING (true)`, public access, or missing function authorization is found.

Do not autonomously login, link, or push. If the user uses Supabase SQL Editor, provide exact safe instructions. If CLI use is separately approved, show exact commands before execution.

## Phase 2: Schema verification

After the user applies the migration, verify:

- `public.gigs` and `public.license_terms` exist;
- constraints and indexes exist;
- RLS is enabled;
- locked terms trigger exists;
- six RPCs exist with expected signatures;
- `PUBLIC` and `anon` cannot execute mutation RPCs;
- `authenticated` can execute only required RPCs;
- no broad table mutation grants exist.

## Phase 3: Runtime workflow

Use real test accounts, one CLIENT and at least two WORKER accounts. Do not hardcode credentials in source or documentation.

CLIENT verification:

1. Create a DRAFT gig and version-one terms atomically.
2. Confirm no orphan gig or orphan terms.
3. Edit the DRAFT.
4. Lock terms.
5. Confirm hash is lowercase SHA-256 hex, 64 characters.
6. Confirm `locked_at` and `TERMS_LOCKED` are written together.
7. Confirm locked terms cannot be updated or deleted.
8. Open the gig.
9. Confirm it appears to WORKER users.
10. Cancel only where the state allows.

WORKER verification:

1. Browse OPEN gigs.
2. Read OPEN gig terms.
3. Claim an OPEN gig.
4. Confirm status becomes CLAIMED and assigned worker is set.
5. Confirm CLIENT cannot claim.
6. Confirm WORKER cannot create, edit, lock, open, or cancel.

## Phase 4: RLS matrix

Verify:

- anonymous cannot read or mutate gigs/terms;
- CLIENT reads only owned gigs/terms;
- another CLIENT cannot read private gigs;
- WORKER reads OPEN gigs and assigned gigs;
- WORKER cannot read another client's DRAFT or unopened TERMS_LOCKED gig;
- WORKER cannot read a gig claimed by a different worker;
- unrelated users cannot mutate rows directly.

## Phase 5: Concurrency

Use two real WORKER accounts against one OPEN gig. Trigger claims as close together as practical.

Expected result:

- exactly one claim succeeds;
- exactly one returns conflict;
- assigned worker is not overwritten;
- final status is CLAIMED;
- conflict maps to `GIG_ALREADY_CLAIMED` and safe Vietnamese copy.

Do not claim concurrency PASS without observing the hosted result.

## Phase 6: UI verification

Verify all authenticated client/worker routes, loading/empty/error states, state-specific actions, Vietnamese copy, no static gig data as the authenticated source of truth, and disclosures that the environment is test-only with no real money, blockchain transaction, or on-chain escrow.

## Completion

Run lint, typecheck, tests, and build sequentially after any corrections. Update documentation status only after real verification. Report PASS/FAIL/SKIP per check. Stop before TASK-002D. Do not commit unless the user explicitly requests it.
