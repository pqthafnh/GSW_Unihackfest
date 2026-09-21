# Skill: Smart Contract Development

## Workflow
1. Read smart-contract spec and escrow ADR.
2. Define accounts, signer constraints, PDA seeds and state guards.
3. Define atomic token movements and event output.
4. Implement one instruction at a time.
5. Add happy-path and negative Anchor tests.
6. Run local validator tests before Devnet deployment.
7. Update IDL, program documentation and deployment evidence.

## Security gates
Reject wrong signer, wrong mint, invalid state, duplicate funding and duplicate settlement.
