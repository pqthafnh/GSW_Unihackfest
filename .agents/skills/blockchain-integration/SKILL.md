# Skill: Blockchain Integration

## Workflow
1. Confirm cluster is Devnet.
2. Load IDL and program ID from validated server configuration.
3. Centralize PDA derivation.
4. Build unsigned transactions server-side where appropriate.
5. Let the user wallet inspect and sign.
6. Submit and capture signature.
7. Confirm server-side and compare program state.
8. Update the database mirror idempotently.
9. Add pending/reconciliation handling and UI states.
