# ADR-004: Solana Escrow

- Status: Accepted for local foundation; deployment gated
- Date: 2026-09-21

## Context
Pre-funded escrow improves payment assurance and provides verifiable settlement.

## Decision
Use an Anchor program with a Gig Escrow PDA and program-controlled native SOL vault on
Devnet. This supersedes TASK-004B's SPL test-token path for the MVP. Each escrow
snapshots fee, treasury and arbiter configuration at initialization so later
configuration changes cannot alter a funded escrow.

## Consequences
Requires strict signer, state and idempotency checks plus reconciliation. The
program ID is a documented placeholder; design/security approval, key generation,
local validator evidence and Devnet deployment are still required. This is not
production-ready and no runtime funding or release UI is enabled.

## Alternatives considered
Database-only escrow was rejected because it would not prove on-chain settlement.

## Migration plan
Any future replacement requires a new ADR, compatibility plan, updated tests and documentation.
