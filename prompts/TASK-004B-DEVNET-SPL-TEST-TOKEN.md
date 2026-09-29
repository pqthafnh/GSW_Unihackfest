# TASK-004B: Devnet SPL Test Token Foundation

## Entry conditions

Start only after TASK-004A real wallet and Devnet transaction verification pass. This task establishes a real test token on Devnet, not escrow.

## Objective

- define or create one Devnet SPL test mint;
- document mint authority custody for test use;
- create associated token accounts when needed;
- mint controlled test balances to demo wallets;
- read balances from Devnet;
- transfer the test token between controlled demo wallets with explicit signing;
- verify token transactions server-side;
- configure verified mint address and decimals safely.

No Mainnet, real-value asset, hidden minting, payment claim, escrow, settlement, or production token branding.

## Security

Never ask for seed phrases or private keys. Never put mint-authority secrets in browser variables, source, logs, or chat. Server-side minting, if approved, must be tightly scoped to Devnet demo operations, rate limited, and disabled in production.

Do not assume USDC. UI must say test token and show the verified Devnet mint/decimals context.

## Mint decision

Before implementation, audit whether a project test mint already exists. If not, propose the exact creation method, authority model, decimals, metadata expectations, and cleanup/rotation plan. Stop for explicit approval before creating a mint or minting tokens.

## Operations

- validate mint address and Devnet cluster;
- derive/create ATA;
- fetch balance;
- controlled airdrop/mint for approved test wallets;
- wallet-signed token transfer;
- RPC confirmation;
- server verification of mint, source, destination, signer, amount, and status.

Use integer atomic amounts and deterministic decimal conversion. Reject overflow, excess precision, zero, negative, and scientific notation.

## UI

Vietnamese UI must clearly label test token, Devnet, mint address, balance, atomic/decimal amount, confirmation state, and Explorer link. No words implying real money, secured payment, funded escrow, or settlement.

## Tests

Pure tests for mint validation, decimals conversion, ATA derivation inputs, amount parsing, overflow/precision rejection, Explorer URLs, transaction verification rules, and safe errors. Real integration only after controlled Devnet setup.

## Required response before implementation

Audit only: existing mint/config, exact dependencies and versions, authority model, decimals, operations, server verification, files, migration/config changes if any, security, tests, commands, and manual Devnet actions. Stop for approval. Do not create a mint, mint tokens, install packages, or edit repository before approval.
