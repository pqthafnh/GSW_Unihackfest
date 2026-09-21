# Database Rules

- Add forward-only migrations; never edit an applied migration.
- Enable RLS on every business table.
- Test policies by role and ownership.
- Store token values as atomic integers.
- Use unique constraints for transaction signatures and one primary receipt per gig.
- Version submissions and license terms.
- Locked terms are immutable.
- Add indexes for foreign keys, status, timestamps and common lookups.
- Store private object paths, not public file URLs.
