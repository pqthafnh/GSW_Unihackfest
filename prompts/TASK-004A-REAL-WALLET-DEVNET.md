# TASK-004A: Real Wallet and Solana Devnet Transaction Proof

## Entry conditions

Start only after TASK-002 backend phases required by the product are stable. This task proves a real browser wallet and real Devnet transaction. It does not implement escrow, payment, or token funding.

## Objective

- discover a Wallet Standard-compatible wallet;
- connect and disconnect a real wallet;
- display the real public key and Devnet SOL balance;
- request an explicit user signature;
- send a safe technical proof transaction on Solana Devnet;
- obtain a real signature;
- confirm it through RPC;
- show a real Devnet Explorer link;
- verify the signature independently on the server.

No fake wallet, address, balance, signature, transaction, Explorer URL, or artificial confirmation.

## Mandatory audit before implementation

Audit Node/Next versions, current dependencies, Solana configuration, frontend architecture, and official current Solana guidance. Propose exact package names and exact versions, and stop for dependency approval before installing anything.

Prefer the modern Solana stack currently recommended by official documentation. Do not add legacy packages without justification. Never use `--force` or `--legacy-peer-deps`.

## Network

Lock the task to Devnet. Do not expose a private RPC credential through `NEXT_PUBLIC_*`. If the browser needs a public endpoint, define a specifically browser-safe variable. No network switcher and no Mainnet.

## Wallet UX

Vietnamese UI:

- Kết nối ví
- Ngắt kết nối
- Địa chỉ ví
- Số dư Devnet
- Ký giao dịch kiểm tra
- Đang chờ xác nhận từ ví
- Đã gửi lên Devnet
- Đang xác nhận
- Đã xác nhận
- Người dùng đã từ chối
- Không thể xác minh
- Xem trên Solana Explorer

Never request or store seed phrase, private key, recovery phrase, or wallet secret. Never auto-sign or submit on page load.

## Proof transaction

Use a safe Devnet technical proof, preferably a memo or another no-value instruction. Do not transfer SOL to an arbitrary third party. Do not call it payment, escrow funding, or gig funding. The connected wallet must review and sign.

Lifecycle:

- disconnected;
- ready;
- waiting for wallet approval;
- submitted;
- confirming;
- confirmed;
- rejected;
- failed;
- confirmation timeout/unknown.

Never show confirmed before RPC confirmation. Do not use fake delays.

## Server verification

Create a server endpoint or server action that accepts only the transaction signature and expected technical context. Do not trust client success, cluster, wallet address, amount, or instruction details.

Server must use configured Devnet RPC, validate signature format, fetch status/transaction, require confirmed/finalized result, verify expected signer and expected proof instruction, and return a safe result with request ID. Do not expose raw RPC errors. Add bounded timeouts and rate limiting if project infrastructure supports it.

Do not update gig funding state or persist payment data.

## Explorer

Only build:

`https://explorer.solana.com/tx/<signature>?cluster=devnet`

from a real signature.

## Testing

Pure tests for Devnet lock, signature validation, address shortening, Explorer URL, lifecycle state machine, rejected/timeout/confirmed states, safe error mapping, and server rejection of malformed or client-asserted success.

Real integration testing requires an available Devnet RPC and controlled wallet/signature setup. Never hardcode a real user's secret.

## Required response before implementation

Audit only: exact SDK strategy and versions, architecture, proof instruction, lifecycle, server verification, routes/files, security controls, acceptance criteria, tests, and commands. Stop for approval. Do not install, edit, connect a wallet, or send a transaction before approval.
