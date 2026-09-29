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

### TASK-002B: Supabase Authentication, Profiles and Roles
- Status: DONE
- Goal: Add real email/password authentication, session refresh, profile creation and role-protected client/worker workspaces.
- Scope: Auth UI/routes, server actions, middleware refresh, profiles migration with trigger/RLS/role protection, server-side authorization and unit tests.
- Exclusions: OAuth, MFA, password reset, admin dashboard, gigs, Storage, blockchain, wallet, Anchor, Metaplex and AI.
- Acceptance criteria: Only CLIENT/WORKER signup is accepted; profiles are created by the auth trigger; profile role is the authorization source; `/client` requires CLIENT and `/worker` requires WORKER; logout invalidates the session; secrets/tokens/passwords are not exposed.
- Tests: Pure unit tests for validation, redirects and role authorization. Hosted RLS/runtime verification is deferred until the migration is applied and is not represented as a fake passing test.
- Docs/ADR impact: Uses accepted ADR-002; adds the forward-only profiles migration and authentication setup notes.

- TASK-002 Supabase schema, Auth and RLS.
- TASK-002C: Gigs, license terms, RLS and atomic claim workflow implemented in `20260923190000_create_gigs_license_terms_and_rpc.sql` and applied to hosted Supabase. Client and worker routes use authenticated Supabase reads and Server Actions; concurrency, full RLS matrix and locked-terms runtime evidence remain incomplete.
- TASK-003 Client creates and locks a gig.
- TASK-004 Anchor escrow initialize and fund.
- TASK-004C: Native SOL Anchor escrow local foundation
  - Status: DONE (Deployed to Devnet: FgSE7P55TqSMW6RciDmzLuq3ti2YWrSc96p9WsEx7zr8)
  - Uses native Devnet SOL, not the SPL test token proposed by TASK-004B for the MVP.
  - Includes a placeholder-ID Anchor workspace, checked arithmetic, snapshot escrow
    economics, state guards, local utilities/tests, Docker and CI skeletons.
  - Excludes deployment, keypair generation, transaction execution, database push,
    reconciliation and frontend funding/release UI.
- TASK-004A: Real Wallet and Solana Devnet Transaction Proof
  - Status: IMPLEMENTED; browser wallet runtime verification pending
  - Goal: Connect a Wallet Standard-compatible browser wallet on Devnet and verify an explicit no-value memo proof.
  - Scope: Client-only connect/disconnect, public key, live Devnet balance, refresh, memo proof lifecycle, Explorer link, and signature-only server verification.
  - Exclusions: No escrow, funding, payment, transfer, airdrop, database state update, secret storage, or TASK-002D changes.
  - Acceptance criteria: Wallet actions require an explicit click; only Devnet is accepted; confirmation is shown only after server-side finalized RPC verification; errors are safe and Vietnamese; proof verification checks a signer and the fixed memo instruction. Static verification passes; manual browser verification requires a real Wallet Standard extension and an explicit user-approved Devnet proof transaction.
  - Tests: Pure Solana configuration/address/Explorer/lifecycle/error mapping tests.
  - Docs/ADR impact: No migration or ADR required.
- TASK-005 Worker assignment and private submission.
- TASK-002D: Private Storage, submissions, revision requests and participant-signed downloads implemented locally; migration remains unapplied.
- TASK-006 AI review adapter and UI panel.
- TASK-007 Settlement and reconciliation.
- TASK-008 Metaplex Core receipt and verify page.
- TASK-009 Dispute/refund demo paths.
- TASK-010 E2E, seed data, deployment and demo hardening.

### TASK-004D: Frontend Escrow Integration
- Status: TODO
- Goal: Connect UI buttons to the Devnet Escrow Smart Contract.
- Scope: Client funding transaction, Worker submission recording, Client approval release.
- Exclusions: Mainnet.
