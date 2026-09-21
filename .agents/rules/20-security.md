# Security Rules

- Server secrets must never use a `NEXT_PUBLIC_` prefix.
- Never expose service-role, AI keys, RPC secrets or mint authority to browser code.
- Never request or store a wallet seed phrase or private key.
- Deliverables use a private bucket and short-lived signed URLs.
- Every mutation requires authentication, authorization, Zod validation and state validation.
- The server verifies transaction signature, program ID, accounts, amounts and resulting state.
- Public receipt views exclude PII, storage paths, signed URLs and dispute evidence.
- Logs must redact credentials and private content.
- Use Devnet only.
