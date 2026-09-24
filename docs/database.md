# Database Design

## Tables
profiles, gigs, license_terms, submissions, ai_reviews, chain_transactions, receipts, disputes and audit_events.

## Key constraints
- Atomic amount uses bigint.
- Transaction signature is unique.
- One primary receipt per gig.
- Terms are versioned and locked before funding.
- Submissions are versioned.
- Foreign keys and status values are constrained.

## RLS principles
Clients access their gigs; assigned workers access required job data; unrelated users cannot access submissions; public access is limited to a safe receipt projection. Service role is restricted to server jobs.

## Indexes
Index ownership, assignment, status, created_at, gig foreign keys, pending transaction status and pending receipt status.

## TASK-002C

The Phase C migration adds `gigs` and `license_terms` with RLS, status constraints, locked-terms immutability and six security-definer RPCs. `budget_atomic` is PostgreSQL `bigint`; `token_mint` remains null until token configuration is verified. Terms are canonicalized and SHA-256 hashed inside the database at lock time. The migration is not applied to hosted Supabase yet.
