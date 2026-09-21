# ADR-002: Authentication and Wallet Ownership

- Status: Accepted
- Date: 2026-09-21

## Context
A wallet proves key control but not legal identity; social/email auth keeps consumer UX accessible.

## Decision
Use Supabase Auth for application identity and a wallet signature to prove control of a payout/funding address.

## Consequences
Backend links a verified wallet to a profile and still authorizes by session and role.

## Alternatives considered
Wallet-only login was rejected for mass-adoption friction.

## Migration plan
Any future replacement requires a new ADR, compatibility plan, updated tests and documentation.
