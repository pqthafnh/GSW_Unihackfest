# Deployment Guide

## Environments
Local, preview and demo. Solana cluster remains Devnet.

## Order
1. Configure Supabase and apply migrations.
2. Create private bucket and policies.
3. Deploy Anchor program to Devnet and record program ID.
4. Create or configure test token and demo wallets.
5. Configure server and public environment values.
6. Deploy Next.js.
7. Run technical connection checks.
8. Seed demo data and record fallback transaction/receipt.

## Rollback
Application rollback must not alter on-chain history. Use forward database migrations and disable affected UI actions if a provider is degraded.

## TASK-002A Supabase foundation

Keep `.env.local` uncommitted. The browser may receive only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; `SUPABASE_SECRET_KEY` is server-only. Run `npm run technical:check` after the `system_health_checks` migration has been applied to the intended Supabase project. Do not use `supabase login`, `supabase link`, or `supabase db push` as part of the foundation task without explicit approval.

For TASK-002B, apply the profiles migration after TASK-002A, enable email/password in Supabase Auth, and configure the allowed callback URL for `/auth/callback`. Do not seed an admin password. Create any administrative profile only through an authorized manual SQL operation.
