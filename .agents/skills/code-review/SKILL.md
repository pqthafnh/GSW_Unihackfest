# Skill: Code Review

## Review order
1. Product scope and acceptance criteria.
2. Architecture boundaries.
3. Authentication and authorization.
4. State transition correctness.
5. Data privacy and secret handling.
6. Idempotency and failure recovery.
7. Tests and documentation.

## Severity
- Blocker: fund loss, secret leak, authorization bypass, mainnet use or double settlement.
- High: broken RLS, false state confirmation, public private-file access.
- Medium: missing retries, weak validation, missing tests.
- Low: maintainability or naming issues.

Return findings with file, location, consequence and recommended fix.
