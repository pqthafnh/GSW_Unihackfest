# Task Backlog

## Template

### TASK-XXX: Title
- Status: TODO
- Goal:
- Scope:
- Exclusions:
- Acceptance criteria:
- Tests:
- Docs/ADR impact:

## MVP tasks
### TASK-001: Project foundation and environment validation
- Status: IN_PROGRESS
- Goal: Establish runnable Next.js application scaffold, styling, env validation, and test runners.
- Scope: App Router skeleton, tailwind/shadcn styling setup, Zod env schemas, foundation tests, technical check script.
- Exclusions: Anchor contracts (TASK-004), Metaplex minting (TASK-008), Supabase migrations (TASK-002), E2E suite (TASK-010).
- Acceptance criteria: npm run lint, typecheck, test, build, and technical:check pass cleanly.
- Tests: tests/unit/foundation.test.ts.
- Docs/ADR impact: Confirms ADR-001 adherence.

### TASK-001A: Product UI Foundation and Demo Shell
- Status: IN_PROGRESS
- Goal: Deliver a premium, trust-first responsive UI foundation for the landing page and simulated client/contributor demo shells.
- Scope: Marketing routes `/` and `/demo`, application routes `/client` and `/worker`, reusable presentation components, deterministic demo data, disclosures and planned technical stack transparency.
- Exclusions: This is not a functional application. No authentication, database, Supabase storage, wallet action, Anchor escrow transaction, payment, settlement, receipt minting, AI provider or blockchain integration is implemented.
- Acceptance criteria: All four routes compile and render; public CTA hrefs map to the approved destinations; demo disclosures are visible; only Solana Devnet is marked Configured; all other planned services are Not connected; dashboards contain no fake business actions; README and this task record describe the simulated scope.
- Tests: `tests/unit/ui-foundation.test.ts` checks deterministic CTA, disclosure, atomic budget, valid status, planned stack and no-runtime-randomness contracts. Route compilation is verified by typecheck/build and runtime manually.
- Docs/ADR impact: Updates README and this task record only. No migration or ADR required.

### TASK-002A: Real Supabase Connection Foundation
- Status: IN_PROGRESS
- Goal: Establish server-safe Supabase clients, a minimal technical migration and a diagnostic database reachability endpoint.
- Scope: Browser/server/admin client boundaries, strict configuration validation, `system_health_checks` migration, `/api/technical/supabase`, safe technical check and tests.
- Exclusions: No product schema, authentication UI, profile flow, gigs API, storage upload, blockchain, wallet, Anchor, Metaplex or AI provider.
- Acceptance criteria: Supabase status is reported only after a real query; missing/unapplied configuration is not reported as connected; secrets never appear in bundles, responses or logs; `/api/health` remains application-only; migration has RLS and no direct insert/select policies.
- Tests: Supabase config/error/diagnostic unit tests; integration verification is pending migration application and is not faked.
- Docs/ADR impact: Updates technical connection and setup documentation. Migration is forward-only and has not been pushed to a hosted project.

- TASK-002 Supabase schema, Auth and RLS.
- TASK-003 Client creates and locks a gig.
- TASK-004 Anchor escrow initialize and fund.
- TASK-005 Worker assignment and private submission.
- TASK-006 AI review adapter and UI panel.
- TASK-007 Settlement and reconciliation.
- TASK-008 Metaplex Core receipt and verify page.
- TASK-009 Dispute/refund demo paths.
- TASK-010 E2E, seed data, deployment and demo hardening.
