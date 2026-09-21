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
