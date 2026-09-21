# ADR-007: Settlement Reconciliation

- Status: Accepted
- Date: 2026-09-21

## Context
Client callbacks and transient RPC responses are not sufficient sources of truth.

## Decision
A server confirmation and background reconciliation process mirror verified on-chain funding and settlement into PostgreSQL.

## Consequences
Pending states, unique signatures and idempotent jobs are required.

## Alternatives considered
Optimistic database settlement was rejected because it can diverge from chain state.

## Migration plan
Any future replacement requires a new ADR, compatibility plan, updated tests and documentation.
