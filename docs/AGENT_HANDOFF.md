# Agent Handoff: Solana Devnet Wallet and Escrow

## Repository

`C:\Users\Bi\Downloads\Unihackfest`

## Primary objective

Continue the current Solana Devnet wallet and native SOL escrow implementation from the existing workspace.

Do not restart the project, regenerate completed features, or discard current changes.

The immediate priority is to verify the latest Anchor build result, verify actual artifacts, run Anchor tests only after a proven successful build, and then continue implementation from the first real blocker.

## Required reading before editing

Read these files before changing source code:

- `AGENTS.md`
- `.agents/rules/*.md`
- relevant `.agents/skills/**/SKILL.md`
- `docs/AGENT_HANDOFF.md`
- `docs/tasks.md`
- `docs/architecture.md`
- `docs/product.md`
- `package.json`
- `docker-compose.yml`
- `Dockerfile`
- `.dockerignore`
- relevant prompts under `prompts/` and `.prompts/`

## Safety rules

Do not discard existing uncommitted work.

Do not run:

- `git reset --hard`
- `git clean -fd`
- `docker system prune`
- `docker volume prune`
- `supabase db reset`
- `supabase db push`
- `supabase migration repair`
- destructive `drop`, `truncate`, or data-deletion commands

Do not:

- read or edit `.env.local`
- deploy without explicit approval
- push or commit without explicit approval
- send wallet transactions automatically
- create or inspect private keypairs
- request private keys or seed phrases
- use Solana Mainnet
- call an airdrop automatically
- run two Anchor builds concurrently
- change Rust, Solana, or Anchor versions randomly
- delete Cargo or Docker caches merely to retry a failed build

## Current product scope

- Supabase Auth with `CLIENT` and `WORKER` roles
- Private submission files in Supabase Storage
- Solana wallet integration on Devnet
- Native Devnet SOL escrow for the MVP
- No SPL token escrow in the current MVP
- Platform fee: `500 BPS`, equivalent to 5%
- Maximum platform fee: `1000 BPS`, equivalent to 10%
- Worker payout: `gross_amount - platform_fee`, approximately 95%
- Integer lamports and checked arithmetic only
- Mainnet is outside scope

## TASK-004A current state

Implemented locally:

- Wallet Standard discovery and connection source
- Devnet public wallet address and balance
- Balance refresh
- Devnet Explorer links
- Memo proof transaction source
- Server-side proof-verification route
- Unit tests and documentation

Known UI issues still requiring review:

1. Phantom may be installed and unlocked while Wallet Standard discovery still fails.
2. Wallet controls are not consistently visible on `WORKER` routes.
3. Wallet provider and wallet summary should move to a shared authenticated layout or provider boundary.
4. `CLIENT` and `WORKER` routes must use a single wallet state.
5. Wallet discovery should handle register/unregister events and expose a manual rescan action.
6. Wallet state must remain available on gig detail and submission routes.

Do not rebuild TASK-004A from scratch. Reuse the existing implementation.

## Escrow architecture

Native Devnet SOL architecture:

- `PlatformConfig` PDA
- `Escrow` PDA
- `Vault` PDA
- Treasury public address
- Platform fee: 500 BPS
- Maximum fee: 1000 BPS
- Worker payout: gross amount minus platform fee
- Checked integer arithmetic
- No floating-point authoritative money calculation
- Blockchain is authoritative for financial state
- Supabase stores application data and an on-chain state cache

Expected instructions:

- `initialize_platform_config`
- `update_platform_fee`
- `update_treasury`
- `update_arbiter`
- `set_paused`
- `initialize_escrow`
- `assign_worker`
- `record_submission`
- `request_revision`
- `approve_and_release`
- `cancel_and_refund`
- `open_dispute`
- `resolve_to_worker`
- `resolve_to_client`

Important settlement rules:

- Release must atomically transfer the worker payout and platform fee.
- Refund before worker assignment returns the full gross amount to the client.
- Platform Treasury receives no fee on a valid pre-assignment refund.
- Client cannot unilaterally refund after worker assignment.
- Released and Refunded are terminal financial states.
- No duplicate release or refund is allowed.

## Docker and Anchor status

Docker Desktop is the local Anchor build environment.

Previous correction:

- Docker build context was approximately 700 MB.
- A root `.dockerignore` was added.
- Build context was reduced to approximately 12.88 kB.
- Docker image build passed.
- `docker compose config` passed.

Container toolchain last reported:

- Rust `1.85.0`
- Cargo `1.85.0`
- Anchor CLI `0.31.1`
- Solana CLI was changed from `2.2.0` to `3.1.14` after a demonstrated SBF compatibility error

Compatibility history:

- Host/container `cargo check` passed.
- Anchor SBF build with Solana CLI `2.2.0` used bundled Rust/Cargo `1.79`.
- `cpufeatures 0.3.1` required Edition 2024 and blocked that SBF build.
- A Docker image with Solana CLI `3.1.14` was built.
- The latest Anchor build ran for a long time and reached platform-tools/IDL stages.
- The latest build result has not yet been proven by both exit code and artifact inspection.

Do not mark `escrow:build` PASS until all of the following are verified:

1. The build container exited with code 0.
2. A non-empty program `.so` artifact exists.
3. A non-empty Anchor IDL JSON exists.
4. Generated TypeScript types exist when required by the current Anchor configuration.

## Immediate next step

Do not start a second build if a previous build container is still running.

Perform these checks first:

1. Inspect Docker containers.
2. Identify the latest Anchor build container.
3. Inspect its status, exit code, and final logs.
4. Inspect real artifacts under `target/`.
5. If exit code is zero and artifacts are valid, mark `escrow:build` PASS.
6. Run `escrow:test` only after build PASS.
7. If the build failed, identify and fix the first meaningful error.
8. Do not change toolchain versions without a specific compatibility error.

Useful commands:

```cmd
docker version
docker info
docker compose version
docker compose config
docker ps --all
docker logs --tail 250 <container-id>
docker inspect <container-id> --format "{{.State.Status}}|{{.State.ExitCode}}|{{.State.Error}}|{{.State.FinishedAt}}"
```

Expected project scripts:

```cmd
npm.cmd run escrow:versions
npm.cmd run escrow:fmt
npm.cmd run escrow:check
npm.cmd run escrow:build
npm.cmd run escrow:test
```

If the latest build passed, verify artifacts before testing:

```cmd
docker compose run --rm escrow-check sh -lc "find target -maxdepth 4 -type f \( -name '*.so' -o -name '*.json' -o -name '*.ts' \) -print | sort"
```

## Anchor verification order

Run sequentially:

1. `npm.cmd run escrow:fmt`
2. `npm.cmd run escrow:check`
3. `npm.cmd run escrow:build`
4. `npm.cmd run escrow:test`

Rules:

- `cargo check` PASS does not imply `anchor build` PASS.
- `anchor build` PASS does not imply `anchor test` PASS.
- Do not reduce or delete tests merely to pass the gate.
- Do not treat warnings as fatal unless they break the build or identify a real defect.
- Do not treat a wrapper message saying “completed” as success without checking exit code.

## Web verification

After source changes, run sequentially:

1. `npm.cmd run lint`
2. `npm.cmd run typecheck`
3. `npm.cmd run test`
4. `npm.cmd run build`
5. `git diff --check`

Previous web verification passed with 48 tests, but all checks must be rerun after meaningful changes.

## TASK-002D warning

TASK-002D has unresolved hosted submissions schema drift.

Do not:

- rerun the failed migration blindly
- run `db push`
- run migration repair
- drop `public.submissions`
- truncate data
- delete Storage objects

TASK-002D must not block local Anchor build, but it must not be declared complete.

## Deployment model

- Docker Desktop: local Anchor build and test
- GitHub Actions: authoritative Anchor verification and manual Devnet deployment
- Vercel: Next.js frontend
- Render: backend and reconciliation worker
- Supabase: Auth, Postgres, RLS, and private Storage
- Solana Devnet: escrow program

The Solana program does not run on Vercel or Render.

Do not deploy until the explicit deploy gate is approved.

## Git handoff checks

Before editing, report:

```cmd
git branch --show-current
git status --short
git diff --check
git log -5 --oneline
```

Do not overwrite or discard modified and untracked files.

## Reporting format

Keep reports short and evidence-based:

- command and PASS/FAIL
- container status and exit code
- first meaningful error
- files changed
- artifacts generated
- Anchor verification
- web verification
- one remaining blocker
- `git status --short`

Do not repeat the full architecture unless the architecture changes.
