# Technical Connection Check

Run `npm run technical:check` for the TASK-002A Supabase technical foundation.

The check performs a real server-side select against `system_health_checks` when Supabase is configured. Auth, Storage, Solana, Anchor, AI and Metaplex are explicitly skipped in this task.

Never print secrets or raw provider errors. A database is PASS only after the real query succeeds; missing configuration is SKIP and an unapplied migration is FAIL.
