# Security Model

## Assets
Test token funds, wallet signatures, private deliverables, license terms, PII, server secrets and mint authority.

## Trust boundaries
Browser, Next.js server, Supabase, AI provider, Solana RPC/program and Metaplex/DAS.

## Controls
Server-side authorization; RLS; private bucket; short-lived signed URLs; secret isolation; transaction verification; idempotency; audit log; input validation; rate limits; content minimization for AI.

## Prohibited
Mainnet, seed phrase collection, client-side service role, public deliverables, unverified settlement state and legal claims that exceed technical proof.

Profile role is the authorization source of truth. Signup metadata is only trigger input and cannot create ADMIN. Protected pages verify the authenticated user server-side and then read the owner profile under RLS.
