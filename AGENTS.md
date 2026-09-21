# AGENTS.md

## Purpose
This is the mandatory entry point for every coding agent working on **Micro-Gig Network**. The product competes in **Best Product & Business** and targets indie game studios and student content contributors.

## Mandatory reading order
1. `AGENTS.md`
2. `.agents/rules/00-core.md`
3. `.agents/rules/10-architecture.md`
4. Task-specific rule
5. `docs/product.md`
6. `docs/architecture.md`
7. Relevant ADR
8. Matching `.agents/skills/*/SKILL.md`
9. Related source and tests
10. `docs/tasks.md`

## Fixed stack
- Next.js App Router, TypeScript strict, Tailwind CSS, shadcn/ui, Zod.
- Supabase PostgreSQL, Auth, RLS and private Storage.
- Solana Devnet, Anchor, SPL-compatible test token and Wallet Adapter.
- Metaplex Core for the post-settlement IP License Receipt.
- AI review as structured, human-in-the-loop signals only.

## Non-negotiable business rules
- Terms are locked before funding.
- Amounts use atomic integers, never floating point.
- Database state becomes `FUNDED` or `SETTLED` only after server-side chain verification.
- Settlement is idempotent and can happen once.
- Receipt minting is separate from settlement and may retry safely.
- Deliverables and PII stay private and off-chain.
- AI never decides payout, authorship or legal ownership.
- The receipt is technical evidence, not automatic legal copyright ownership.
- MVP uses Devnet and test assets only.

## Required task preface
Before modifying code, report:
- scope and exclusions;
- assumptions;
- acceptance criteria;
- files to create or modify;
- migrations or ADRs required;
- tests to add or update.

## Required verification
Run the scripts available in `package.json`, normally:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

For Anchor changes:

```bash
cd programs/escrow && anchor test
```

Never claim success for a command that was not run.

## Definition of Done
A task is done only when acceptance criteria pass, authorization is server-side, inputs are validated, tests pass, no secret leaks, documentation is updated and remaining risks are stated.
