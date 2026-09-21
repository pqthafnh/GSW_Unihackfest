# Processing Pipeline

1. Create: validate brief and create DRAFT.
2. Lock terms: version terms and store SHA-256.
3. Fund: build, sign, submit and confirm escrow funding.
4. Submit: private upload, canonicalize and hash.
5. Review: AI signals and human decision.
6. Settle: signed approval, atomic payout and fee.
7. Receipt: idempotent Core asset mint.
8. Verify: Explorer, DAS and safe public view.

Control gates cover failure paths, pending RPC states, idempotency and security checks.
