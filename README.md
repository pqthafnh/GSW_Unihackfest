# Micro-Gig Network

A trust-first Product UI Foundation and Demo Shell for creative micro-gigs. The current UI demonstrates how indie game studios and contributors can align on briefs, terms and review context before backend, escrow, storage, AI and receipt integrations are connected.

## Demo routes

- `/`: product overview and planned architecture
- `/demo`: choose a simulated client or contributor workspace
- `/client`: client studio shell with static demo records
- `/worker`: contributor workspace with static demo records

The demo uses simulated data and test-asset labels only. No real funds move and no blockchain transaction is submitted. Solana Devnet is configured for the foundation; Anchor Escrow, Private Storage, Metaplex Core and AI Review remain **Not connected**.

## Product scope

**In scope for TASK-001A:** responsive marketing UI, demo selection, client/contributor dashboard shells, deterministic demo data, trust disclosures and planned technical stack transparency.

**Planned product scope:** gig creation, license selection, test-token escrow, private submission upload, content hashing, AI-assisted review, human approval, settlement, receipt minting and public safe verification.

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
Use `docs/deployment.md`, `docs/testing.md` and the technical connection checklist before declaring the demo ready. Never use mainnet or a real-value asset in the MVP. TASK-001A is not a functional application or blockchain integration.

## Supabase foundation

TASK-002A adds real Supabase client boundaries and `GET /api/technical/supabase`. Configure the public values and server-only `SUPABASE_SECRET_KEY` in an uncommitted `.env.local`. The diagnostic endpoint reports database reachability only after a real query; Auth and Storage remain not checked. The technical migration is forward-only and has not been pushed to a hosted project.

## TASK-002C backend workflow

TASK-002C adds a forward-only gigs and license-terms migration, server-side role authorization, atomic RPC state transitions and real Supabase-backed client/worker gig routes. Gig data is real backend data in the test environment, and budgets use atomic integer test units. Terms hashes are calculated in PostgreSQL and are not on-chain proofs. Storage, submissions, funding, blockchain transactions, settlement and receipt minting remain out of scope.
