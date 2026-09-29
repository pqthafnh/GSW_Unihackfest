# MASTER ORCHESTRATOR: TOÀN BỘ TASK CHƯA CODE

## Mục tiêu

Điều phối và hoàn tất toàn bộ các task chưa được code trong repository, bắt đầu từ TASK-002D và tiếp tục lần lượt qua TASK-004A, TASK-004B và TASK-004C.

TASK-002C đã hoàn thành backend cơ bản và không được triển khai lại. Chỉ được sửa TASK-002C nếu một lỗi tương thích trực tiếp chặn task hiện tại, và phải báo rõ trước khi sửa.

Prompt này là nguồn điều phối duy nhất. Không yêu cầu người dùng paste lại prompt con. Sau mỗi approval gate, tiếp tục đúng bước đang dừng.

## Repository root

`C:\Users\Bi\Downloads\Unihackfest`

Chỉ làm việc trong repository này. Không làm việc trong attachment tạm, AppData hoặc bản sao khác.

## Danh sách task chưa code và thứ tự bắt buộc

1. `TASK-002D`: Private Storage và Submissions
2. `TASK-004A`: Real Wallet và Solana Devnet transaction proof
3. `TASK-004B`: Devnet SPL Test Token
4. `TASK-004C`: Anchor Escrow trên Solana Devnet

Không chuyển task khi task trước chưa đạt acceptance criteria hoặc chưa được người dùng cho phép tiếp tục.

## Prompt con cần đọc

Đọc khi bắt đầu task tương ứng:

- `prompts/TASK-002D-PRIVATE-STORAGE-SUBMISSIONS.md`
- `prompts/TASK-002D-RUNTIME-STORAGE-RLS.md`
- `prompts/TASK-004A-REAL-WALLET-DEVNET.md`
- `prompts/TASK-004B-DEVNET-SPL-TEST-TOKEN.md`
- `prompts/TASK-004C-ANCHOR-ESCROW-DEVNET.md`

Nếu file cần thiết không tồn tại, báo chính xác file thiếu và dừng. Không tự đoán nội dung.

## Mandatory reading một lần ở đầu phiên

- `AGENTS.md`
- `.agents/rules/**`
- các skill liên quan database migration, API, security, testing và feature implementation trong repository
- `prompts/TASK-002-COMPLETE-BACKEND.md` nếu tồn tại
- migration TASK-002B và TASK-002C
- source Auth, profiles, gigs, Supabase clients, routes CLIENT/WORKER, tests và docs hiện tại

Không đọc hoặc in `.env.local`. Chỉ kiểm tra tên biến thông qua `.env.example` hoặc source config không chứa secret.

## Nguyên tắc tiết kiệm context và token

1. Đọc rules và tài liệu nền đúng một lần.
2. Mỗi task chỉ đọc prompt và source liên quan trực tiếp.
3. Không scan lại toàn repository giữa các stage nếu không có lý do.
4. Dùng targeted search, targeted reads, `git status`, `git diff --stat` và `git diff --check`.
5. Không paste lại toàn bộ source hoặc SQL trong báo cáo, trừ đoạn lỗi cần review.
6. Không chạy lại verification nếu source không thay đổi.
7. Báo cáo ngắn theo mẫu cuối file.
8. Không yêu cầu người dùng gửi lại prompt sau approval.

## Quy tắc an toàn bất biến

- Không đọc, in hoặc sửa `.env.local`.
- Không lộ secret, token, cookie, session, signed URL, private key hoặc seed phrase.
- Không dùng `npm install --force` hoặc `--legacy-peer-deps`.
- Không tự login, link hoặc db push Supabase.
- Không tự apply hosted migration hoặc Storage policy trước approval.
- Không tạo public bucket hoặc public Storage URL.
- Không dùng admin client để bỏ qua authorization trong user-facing flow.
- Không tự kết nối ví, yêu cầu chữ ký, gửi transaction, tạo mint, mint token, tạo keypair hoặc deploy program.
- Không tự commit hoặc push Git.
- Không sửa migration đã apply. Mọi correction sau apply phải dùng migration mới.
- Không tuyên bố PASS nếu chưa có verification thật.
- Không trộn code của hai task vào cùng migration hoặc commit.

# APPROVAL GATES

## Gate A: Implementation plan

Dừng trước khi bắt đầu code một task mới. Báo audit, thiết kế, exact file plan, migration plan, dependencies, tests, risk và acceptance criteria.

## Gate B: Dependency/toolchain

Dừng trước khi thêm, đổi hoặc xóa dependency, lockfile, Solana CLI, Anchor CLI hoặc toolchain. Nêu exact package và exact version.

## Gate C: Hosted/database/storage

Dừng trước khi apply migration, tạo bucket hosted, đổi policy hosted, SQL Editor hosted, Supabase login/link/push hoặc tạo hosted test data bằng automation.

## Gate D: Wallet/Solana

Dừng trước khi kết nối ví thật, yêu cầu chữ ký, gửi Devnet transaction, tạo mint, mint token, transfer token, tạo keypair, deploy hoặc upgrade Anchor program.

## Gate E: Commit

Dừng trước commit hoặc push. Báo exact staged files, proposed commit message và verification results.

Khi người dùng phê duyệt một gate, tiếp tục đúng bước đang dừng, không yêu cầu paste lại prompt.

# TASK-002D: PRIVATE STORAGE VÀ SUBMISSIONS

## Stage 002D-1: Audit và thiết kế

Đọc hai prompt TASK-002D. Audit TASK-002C dependency và thiết kế:

- `public.submissions`
- chỉ hai status `SUBMITTED`, `REVISION_REQUESTED`
- versioning giữ lịch sử
- CLIENT owner revision request
- private bucket
- server-generated object path
- safe filename và path traversal protection
- MIME allowlist
- size limit
- SHA-256 từ bytes thật
- upload orchestration
- compensation cleanup
- short-lived signed URLs
- RLS và Storage policies
- routes/UI CLIENT và WORKER
- unit tests và hosted runtime matrix

Schema tối thiểu:

```text
id uuid primary key default gen_random_uuid()
gig_id uuid not null references public.gigs(id) on delete restrict
worker_id uuid not null references public.profiles(id) on delete restrict
version integer not null
submission_title text not null
summary text not null
object_path text not null
original_file_name text not null
mime_type text not null
size_bytes bigint not null
content_hash text not null
notes text null
status text not null default 'SUBMITTED'
submitted_at timestamptz not null default now()
created_at timestamptz not null default now()
```

Object path:

```text
gigs/<gig_id>/submissions/<submission_id>/<safe_file_name>
```

Dừng Gate A trước implementation.

## Stage 002D-2: Local implementation

Sau approval:

- tạo đúng một migration mới hơn TASK-002C;
- không sửa migration đã apply;
- tạo domain/validation/authorization/path/hash/repository/service/storage/upload/cleanup/actions hoặc route handler;
- tạo routes:
  - `/worker/cong-viec/[gigId]/nop-bai`
  - `/client/cong-viec/[gigId]/bai-nop`
- thêm UI tiếng Việt;
- thêm pure unit tests;
- không tạo public URL;
- không tin identity/path/version/hash/status từ browser.

Upload flow:

1. require authenticated WORKER;
2. verify assigned worker và gig state;
3. validate metadata/file/MIME/size;
4. generate ID/path server-side;
5. hash bytes thật;
6. upload private object;
7. insert metadata bằng RPC/transaction phù hợp;
8. nếu insert fail, cleanup object;
9. không tạo metadata khi upload fail.

Chạy tuần tự:

```text
npm run lint
npm run typecheck
npm run test
npm run build
git diff --check
```

Dừng Gate C để review/apply migration và Storage policies.

## Stage 002D-3: Hosted verification

Sau approval:

- apply migration có kiểm soát;
- verify submissions schema, constraints, indexes, RLS, RPC, grants/revokes;
- verify bucket private;
- verify Storage policies không broad;
- verify no public URL.

## Stage 002D-4: Runtime verification

Dùng CLIENT owner, assigned WORKER, unrelated WORKER/CLIENT và anonymous.

Kiểm tra:

- assigned WORKER upload version 1;
- object path do server tạo;
- SHA-256 khớp bytes thật;
- CLIENT owner và assigned WORKER lấy signed URL;
- unrelated và anonymous bị deny;
- invalid MIME, oversized file và traversal bị reject;
- revision request;
- version tiếp theo chỉ sau revision request;
- history được giữ;
- upload failure không tạo metadata;
- DB failure sau upload kích hoạt cleanup;
- bucket không public.

Sau correction nếu có, chạy lại static verification. Dừng Gate E trước commit.

Commit đề xuất:

`feat: add private submissions and storage workflow`

TASK-002D chỉ COMPLETE khi hosted runtime/RLS/Storage matrix đã có kết quả thật và có commit riêng.

# TASK-004A: REAL WALLET VÀ DEVNET TRANSACTION PROOF

Chỉ bắt đầu sau TASK-002D COMPLETE.

## Stage 004A-1: Audit và dependency plan

Đọc prompt TASK-004A và audit:

- Next.js/React/Node hiện tại;
- package hiện tại;
- official current Solana wallet strategy;
- exact package names và versions;
- browser-safe Devnet RPC config;
- Wallet Standard discovery;
- connection lifecycle;
- safe proof transaction, ưu tiên no-value memo;
- server-side signature verification;
- Explorer Devnet URL;
- tests và routes/files.

Không dùng fake wallet, fake balance, fake signature hoặc fake confirmation.

Dừng Gate A, sau đó Gate B nếu cần dependency.

## Stage 004A-2: Local implementation

Sau approval dependency:

- wallet connect/disconnect;
- real public key;
- Devnet SOL balance;
- explicit user signature;
- safe technical proof transaction;
- lifecycle states;
- server verification bằng signature và expected context;
- safe error mapping;
- no private key/seed phrase;
- no auto-sign;
- no real payment/funding state.

Chạy lint/typecheck/test/build. Dừng Gate D trước ví và transaction thật.

## Stage 004A-3: Devnet runtime

Sau approval:

- connect wallet;
- sign technical proof;
- submit Devnet;
- confirm through RPC;
- verify server-side signer/instruction/status;
- show real Explorer link;
- test reject/timeout/failure states.

Dừng Gate E trước commit.

Commit đề xuất:

`feat: add real wallet and Devnet proof transaction`

# TASK-004B: DEVNET SPL TEST TOKEN

Chỉ bắt đầu sau TASK-004A COMPLETE.

## Stage 004B-1: Audit và design

Đọc prompt TASK-004B. Audit mint hiện có. Nếu chưa có, đề xuất:

- exact token SDK/tooling;
- mint creation method;
- decimals;
- mint authority custody;
- production disable strategy;
- ATA handling;
- controlled test minting;
- balance read;
- wallet-signed transfer;
- server verification;
- integer atomic amount conversion;
- tests và security.

Dừng Gate A/B và Gate D trước mint/keypair/minting/transfer.

## Stage 004B-2: Implementation và runtime

Sau approvals:

- configure verified Devnet mint;
- ATA derive/create;
- balance display;
- controlled test distribution;
- explicit transfer signing;
- server verify mint/source/destination/signer/amount/status;
- UI ghi rõ test token và Devnet;
- không gọi là payment, escrow hoặc real money.

Chạy static verification, Devnet runtime verification rồi dừng Gate E.

Commit đề xuất:

`feat: add Devnet SPL test token workflow`

# TASK-004C: ANCHOR ESCROW DEVNET

Chỉ bắt đầu sau TASK-004B COMPLETE.

## Stage 004C-1: Program design và threat model

Đọc prompt TASK-004C. Thiết kế trước code:

- Anchor/Solana exact toolchain versions;
- program accounts;
- PDA seeds;
- initialize/fund/release/refund/close instructions;
- state enum;
- authority model;
- mint/amount/gig bindings;
- vault authority PDA;
- replay protection;
- one-time release/refund;
- error codes;
- upgrade authority custody;
- frontend client;
- server reconciliation;
- database integration;
- local validator tests;
- Devnet deploy plan;
- rollback/upgrade plan.

Dừng Gate A/B trước code/toolchain và Gate D trước keypair/build/deploy/funding.

## Stage 004C-2: Local implementation

Sau approvals:

- implement Anchor program;
- generate/use approved program identity strategy;
- IDL/client generation;
- local validator tests;
- unauthorized signer tests;
- wrong mint/account/amount tests;
- duplicate fund/release/refund tests;
- release/refund exclusivity;
- server verification/reconciliation;
- frontend explicit wallet lifecycle;
- no Mainnet or real-value funds.

## Stage 004C-3: Devnet deployment và runtime

Sau Gate D approval:

- deploy/upgrade Devnet;
- verify program ID;
- initialize escrow;
- fund with test token;
- independently reconcile on-chain state;
- release/refund allowed paths;
- verify no double action;
- verify Explorer and RPC confirmation;
- run final static/runtime suite.

Dừng Gate E trước commit.

Commit đề xuất:

`feat: add Anchor escrow workflow on Devnet`

Không chuyển sang task khác sau TASK-004C.

# Error handling

Nếu verification lỗi:

1. phân loại source, environment, hosted state, dependency hay external service;
2. chỉ sửa trong phạm vi task hiện tại;
3. chạy lại check bị ảnh hưởng và các check sau;
4. nếu cần approval, dừng tại gate phù hợp;
5. không dùng fake PASS, broad privileges, force flags hoặc bypass security.

# Acceptance criteria tổng

## TASK-002D

- private submissions/Storage/versioning/revision/signed URLs/RLS hoạt động thật;
- lint/typecheck/tests/build PASS;
- hosted runtime matrix hoàn tất;
- commit riêng.

## TASK-004A

- ví thật kết nối;
- transaction proof thật trên Devnet;
- RPC/server verification thật;
- commit riêng.

## TASK-004B

- test mint Devnet được xác minh;
- ATA/balance/mint/transfer test hoạt động;
- server verification thật;
- commit riêng.

## TASK-004C

- Anchor escrow chạy trên Devnet;
- invariants và security tests PASS;
- funding/release/refund/reconciliation thật với test token;
- commit riêng.

# Báo cáo chuẩn sau mỗi stage

```text
Task: <TASK-002D|TASK-004A|TASK-004B|TASK-004C>
Stage: <audit|implementation|hosted|runtime|commit>
Status: PASS | FAILED | BLOCKED | WAITING_APPROVAL
Completed: <ngắn>
Files: <ngắn>
Migration/Program: <ngắn>
Verification: <lint/typecheck/test/build/runtime>
Hosted/Devnet changes: <none|pending approval|applied and verified>
Security: <ngắn>
Blocker: <none hoặc cụ thể>
Next: <một bước>
```

# Bắt đầu

1. Xác nhận repository root.
2. Kiểm tra các prompt con tồn tại.
3. Đọc mandatory files đúng một lần.
4. Xác minh ngắn TASK-002C và working tree.
5. Xác định task chưa code đầu tiên là TASK-002D.
6. Thực hiện audit/design TASK-002D.
7. Dừng Gate A đầu tiên.
8. Sau mỗi approval, tiếp tục đúng stage.
9. Không yêu cầu paste lại prompt.
10. Không bỏ qua các hosted, wallet hoặc deployment gate.
