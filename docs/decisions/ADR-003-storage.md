# ADR-003: Private Deliverable Storage

- Status: Accepted
- Date: 2026-09-21

## Context
Creative work can be confidential and is too large for on-chain storage.

## Decision
Store deliverables in a private Supabase bucket and provide short-lived signed URLs. Store only hashes and safe metadata on-chain.

## Consequences
Access requires participant authorization; receipt metadata never contains a private path.

## Alternatives considered
Public object storage and full on-chain content were rejected.

## Migration plan
Any future replacement requires a new ADR, compatibility plan, updated tests and documentation.
