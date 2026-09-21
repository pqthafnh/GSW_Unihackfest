# Skill: Database Migration

## Workflow
1. Read `docs/database.md` and related ADRs.
2. Inspect current migrations and generated types.
3. Design a forward-only migration with constraints and indexes.
4. Add or update RLS policies.
5. Add rollback notes without modifying applied migrations.
6. Reset a local database and run policy tests.
7. Regenerate database types.
8. Update database documentation.

## Gates
No float money fields, no public deliverable URLs, and no business table without RLS.
