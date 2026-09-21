# System Architecture

## Context
The application uses a hybrid architecture. Private business data remains off-chain; escrow and settlement proof use Solana Devnet.

## Components
- Next.js experience and application server.
- Supabase Auth, PostgreSQL with RLS and private Storage.
- Anchor escrow program and test token accounts.
- AI review provider adapter.
- Metaplex Core receipt adapter.
- Reconciliation jobs for pending transactions and receipts.

## Sources of truth
- Solana program state: funding and settlement.
- PostgreSQL: profiles, briefs, terms, submissions, reviews, audit and query mirror.
- Private Storage: deliverable and terms files.
- Metaplex Core/DAS: receipt asset existence and metadata.

## Reliability
All external operations support pending states, idempotent confirmation and reconciliation. Receipt failure must never repeat settlement.
