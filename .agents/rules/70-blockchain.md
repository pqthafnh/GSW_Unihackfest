# Blockchain Rules

- Devnet only for the MVP.
- PDA seeds are centralized, documented and identical in client/server tests.
- Verify signer authority, program ownership, token mint and account constraints.
- Payout, platform fee and settlement state update must be atomic.
- Use checked integer arithmetic and explicit fee bounds.
- Emit events for funding, submission, settlement, refund and dispute.
- Never update the database solely from a client-provided signature.
- Reconcile pending transactions using RPC and program state.
- Receipt minting is post-settlement and idempotent.
