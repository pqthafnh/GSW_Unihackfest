# Unfinished Task Prompt Index

This package contains prompts for all unfinished tasks identified from the current project conversation.

## Current unfinished tasks

1. `TASK-002C-FINAL-SQL-REVIEW.md`
   - Correct and approve the Phase C migration before hosted apply.
2. `TASK-002C-RUNTIME-RLS-CONCURRENCY.md`
   - Apply/verify Phase C on hosted Supabase after explicit approval.
3. `TASK-002D-PRIVATE-STORAGE-SUBMISSIONS.md`
   - Design and implement private Storage and submissions after Phase C is committed.
4. `TASK-002D-RUNTIME-STORAGE-RLS.md`
   - Apply and verify Phase D on hosted Supabase.
5. `TASK-004A-REAL-WALLET-DEVNET.md`
   - Real wallet connection and safe Devnet transaction proof.
6. `TASK-004B-DEVNET-SPL-TEST-TOKEN.md`
   - Real Devnet SPL test-token foundation.
7. `TASK-004C-ANCHOR-ESCROW-DEVNET.md`
   - Real Anchor escrow deployment and integration on Devnet.

## Completed or substantially completed

- TASK-002A: Supabase connection foundation.
- TASK-002B: Auth, profiles, and roles.
- TASK-002C implementation code and static verification, pending final SQL review and hosted runtime verification.

## Recommended order

```text
TASK-002C Final SQL Review
-> TASK-002C Hosted Runtime/RLS/Concurrency
-> commit TASK-002C
-> TASK-002D Implementation
-> TASK-002D Hosted Runtime/Storage/RLS
-> commit TASK-002D
-> TASK-004A
-> TASK-004B
-> TASK-004C
```

Each implementation and hosted/runtime phase requires separate approval. Do not merge migrations or skip runtime verification.
