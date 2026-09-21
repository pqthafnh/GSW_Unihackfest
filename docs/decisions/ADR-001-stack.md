# ADR-001: Application Stack

- Status: Accepted
- Date: 2026-09-21

## Context
A single TypeScript application reduces integration overhead for the hackathon while preserving clear layer boundaries.

## Decision
Use Next.js App Router with TypeScript strict, Tailwind/shadcn, Zod, Supabase, Solana Devnet/Anchor and Metaplex Core.

## Consequences
Fast delivery and shared types; care is required to keep server secrets out of Client Components.

## Alternatives considered
Separate backend service, other UI frameworks and multi-chain stacks were rejected for MVP complexity.

## Migration plan
Any future replacement requires a new ADR, compatibility plan, updated tests and documentation.
