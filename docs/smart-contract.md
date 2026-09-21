# Smart Contract Specification

## Program
Anchor escrow program on Solana Devnet.

## Accounts
- Gig Escrow PDA: parties, amount, fee basis points, mint, hashes, deadline and status.
- Token Vault PDA/ATA: program-controlled test-token balance.
- Client, worker and treasury token accounts.

## Instructions
`initialize_gig`, `fund_gig`, `assign_worker`, `submit_work_hash`, `approve_and_settle`, `cancel_and_refund`, `open_dispute`.

## Invariants
Correct signer, allowed state, accepted mint, fixed economics after funding, checked arithmetic and one settlement. Payout, platform fee and state update are atomic.

## Events
GigInitialized, GigFunded, WorkerAssigned, WorkSubmitted, GigSettled, GigRefunded and DisputeOpened.
