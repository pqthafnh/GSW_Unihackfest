# Testing Strategy

## Unit
Schemas, state machine, permissions, fees, hashing and terms locking.

## Integration
API auth, authorization, RLS, signed upload, duplicate confirmation, reconciliation and receipt retry.

## Anchor
Happy path, wrong signer, wrong mint, invalid state, double fund, double settlement and refund.

## E2E
Client creates and funds a gig, worker submits, client approves, settlement confirms and receipt is visible.

## Release gate
Lint, typecheck, unit tests, relevant integration tests, Anchor tests and production build must pass. Record known skips explicitly.
