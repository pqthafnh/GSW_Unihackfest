# Architecture Rules

## Layer boundaries
- Route handlers parse, authenticate, validate and call services.
- Services own business rules, permissions, state transitions and orchestration.
- Repositories own persistence only.
- Chain adapters build and verify transactions only.
- AI adapters return structured signals only.
- Receipt adapters mint or read receipts and never settle funds.

## Consistency
- The chain is authoritative for escrow funding and settlement.
- The database is a query-friendly mirror reconciled after verification.
- Receipt minting is asynchronous and separate from settlement.
- Use dependency injection or explicit adapter interfaces to make providers testable.
