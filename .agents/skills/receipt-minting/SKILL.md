# Skill: Receipt Minting

## Preconditions
Settlement is verified and the gig has no existing primary receipt.

## Workflow
1. Build safe metadata from gig ID, content hash, terms hash, license type and settlement signature.
2. Exclude file URLs, storage paths and PII.
3. Check idempotency key and existing asset.
4. Mint a Metaplex Core asset on Devnet.
5. Verify the asset through SDK or DAS.
6. Persist asset ID and status.
7. Retry timeout/error cases without re-settling funds.
8. Update the public verify view and tests.
