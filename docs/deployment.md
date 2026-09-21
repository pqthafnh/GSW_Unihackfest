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
