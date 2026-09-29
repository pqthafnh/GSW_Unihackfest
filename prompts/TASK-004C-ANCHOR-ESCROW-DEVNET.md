# TASK-004C: Anchor Escrow on Solana Devnet

## Entry conditions

Start only after:

- real wallet/transaction proof passes;
- Devnet SPL test token foundation passes;
- gig/terms backend workflow is runtime verified;
- program design and security review receive explicit approval.

## Objective

Implement a real Anchor escrow program on Devnet for the test token:

- initialize escrow for one eligible gig;
- derive deterministic PDAs;
- fund a program-controlled token vault;
- verify funding on-chain and server-side;
- release to assigned worker only through an allowed settlement path;
- refund only through an allowed cancellation/refund path;
- prevent double release/refund and unauthorized actions;
- reconcile on-chain state with Supabase without trusting client assertions.

No Mainnet or real-value funds.

## Program design required before code

Specify accounts, PDA seeds, instruction set, state enum, authority model, token program compatibility, rent/close behavior, replay protection, amount/mint/gig bindings, error codes, and all state transitions.

At minimum evaluate instructions equivalent to:

- initialize escrow;
- fund escrow;
- release escrow;
- refund escrow;
- close completed/cancelled escrow where safe.

Do not add dispute arbitration without a separate product decision.

## Invariants

- gig identity is bound deterministically;
- client wallet and assigned worker wallet are bound explicitly;
- mint and amount cannot change after initialization;
- vault authority is a PDA;
- only the expected client can fund;
- only authorized settlement/refund paths can move vault tokens;
- release and refund are mutually exclusive and one-time;
- amount uses atomic integer units;
- token accounts and mint are verified;
- program ID and cluster are locked to Devnet for this phase.

## Backend reconciliation

Client submits only transaction signature/context. Server independently fetches the transaction/account state, verifies program ID, instruction, signers, PDA, mint, amount, gig binding, and confirmation. Only then may Supabase transition to a funded/released/refunded state.

Design idempotent reconciliation and recovery for submitted-but-not-yet-confirmed transactions. Never mark funded from a client boolean.

## Frontend

Vietnamese transaction lifecycle with explicit wallet approval, simulation/error handling, signature, confirmation, Explorer link, retry/reconcile behavior, and clear Devnet/test-token disclosure. Never hide instructions or auto-submit.

## Testing

- Anchor unit/integration tests on local validator where appropriate;
- PDA and invariant tests;
- unauthorized signer tests;
- wrong mint/amount/account tests;
- duplicate fund/release/refund tests;
- release/refund exclusivity;
- server verification and reconciliation tests;
- Devnet smoke test only after deploy approval.

## Deployment controls

Before deploy, report exact Anchor/Solana toolchain versions, program ID strategy, upgrade authority custody, build reproducibility, IDL/client generation, deployment command, and rollback/upgrade plan. Stop for explicit approval before building with new dependencies, generating keys, deploying, or funding.

## Required response before implementation

Audit and design only: program accounts, instructions, PDAs, invariants, state machine, threat model, client architecture, backend verification, database integration, exact dependencies/toolchain, file plan, tests, deploy plan, acceptance criteria, and manual approvals. Do not code, install, generate keypairs, deploy, or transact before approval.
