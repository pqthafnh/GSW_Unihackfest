# Data Flow

1. Client sends brief, budget, deadline and license selection through validated UI.
2. Backend stores gig and versioned terms in PostgreSQL.
3. Client signs a Devnet funding transaction; server verifies and mirrors `FUNDED`.
4. Worker uploads a file via a signed private-storage URL.
5. Server canonicalizes the file, computes SHA-256 and stores submission metadata.
6. AI receives minimized safe text and returns structured signals.
7. Client signs settlement; server verifies chain state and mirrors `SETTLED`.
8. Receipt worker mints a Core asset using safe hashes and transaction proof.
9. Public verify view exposes safe metadata only.
