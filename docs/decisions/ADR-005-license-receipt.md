# ADR-005: IP License Receipt

- Status: Accepted
- Date: 2026-09-21

## Context
The receipt should be verifiable without exposing the work or claiming automatic legal ownership.

## Decision
Mint a Metaplex Core asset after settlement. The receipt contains safe hashes, license type and settlement proof.

## Consequences
Receipt minting is asynchronous and idempotent; cNFT remains a scale roadmap option.

## Alternatives considered
Minting before settlement and embedding private files were rejected.

## Migration plan
Any future replacement requires a new ADR, compatibility plan, updated tests and documentation.
