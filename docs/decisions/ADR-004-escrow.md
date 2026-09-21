# ADR-004: Solana Escrow

- Status: Accepted
- Date: 2026-09-21

## Context
Pre-funded escrow improves payment assurance and provides verifiable settlement.

## Decision
Use an Anchor program with a Gig Escrow PDA and program-controlled token vault on Devnet.

## Consequences
Requires strict signer, mint, state and idempotency checks plus reconciliation.

## Alternatives considered
Database-only escrow was rejected because it would not prove on-chain settlement.

## Migration plan
Any future replacement requires a new ADR, compatibility plan, updated tests and documentation.
