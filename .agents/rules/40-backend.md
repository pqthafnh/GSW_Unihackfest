# Backend Rules

- Validate environment and request payloads with Zod.
- Authorization is server-side and never inferred from hidden UI.
- Use a common success/failure response envelope with request ID.
- State transitions go through the domain state machine.
- Confirmation endpoints are idempotent.
- RPC timeout creates a pending state and reconciliation work, not a false failure.
- Receipt errors never trigger a second payout.
- Provider errors are mapped to safe domain errors.
