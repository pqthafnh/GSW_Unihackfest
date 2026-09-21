# Micro-Gig Network

A hackathon MVP for creative micro-gigs. Indie game studios fund work through a Solana Devnet escrow, contributors submit deliverables privately, clients review the work, settlement pays the contributor, and a verifiable IP License Receipt is issued after settlement.

## Product scope

**In scope:** gig creation, license selection, test-token escrow, private submission upload, content hashing, AI-assisted review, human approval, settlement, receipt minting and public safe verification.

**Out of scope:** mainnet funds, legal copyright adjudication, secondary marketplace, guaranteed off-platform royalties, DAO arbitration and multi-chain support.

## Documentation map
- `AGENTS.md`: mandatory coding-agent instructions.
- `.agents/rules/`: persistent engineering constraints.
- `.agents/skills/`: task workflows.
- `.agents/agents/`: specialist review personas.
- `docs/`: product and engineering specifications.
- `docs/decisions/`: architecture decision records.

## Intended commands

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

## Technical readiness
Use `docs/deployment.md`, `docs/testing.md` and the technical connection checklist before declaring the demo ready. Never use mainnet or a real-value asset in the MVP.
