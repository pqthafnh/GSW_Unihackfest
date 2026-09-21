# Technical Connection Check

Run `npm run technical:check` after the application and integration script exist.

A connection is ready only when configuration, network, authorization and a safe functional round trip pass for Next.js, Supabase DB/Auth/private Storage, Solana Devnet RPC, escrow program, test token, wallet, AI provider, Metaplex/DAS, reconciliation and public verification.

Never print secrets, use Mainnet or leave `tech_check_*` data after a deep check. Results use PASS, WARN, FAIL and SKIP. Any FAIL means NOT TECHNICALLY CONNECTED.
