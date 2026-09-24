# TASK-002C: Công việc, điều khoản, RLS và API thật

## Bắt buộc đọc

Đọc: `AGENTS.md`, `.agents/rules/**`, các skill database/API/feature liên quan, `docs/{product,architecture,database,api,security,workflows,testing,ui,tasks}.md`, `TECHNICAL-CONNECTION-CHECK.md`, toàn bộ `src/`, `tests/`, `supabase/migrations/`, `package.json`, `middleware.ts`, `.env.example`.

Nếu file dài, đọc từ dòng 1 đến EOF theo từng khoảng tối đa 100 dòng. Không dùng nội dung bị cắt trong conversation làm source of truth.

## Hiện trạng

Đã có Next.js, UI tiếng Việt, Supabase Database thật, Auth email/password, profiles, role `CLIENT|WORKER|ADMIN`, session cookie, middleware refresh, authorization server-side và RLS profiles.

Chưa có gigs, license terms, submissions, Storage, payment hoặc blockchain.

## Phạm vi

Triển khai backend thật cho:

- tạo và sửa công việc nháp;
- khóa điều khoản;
- mở công việc;
- cộng tác viên nhận việc;
- hủy công việc hợp lệ;
- RLS;
- RPC nguyên tử;
- dashboard dùng dữ liệu Supabase thật.

Ngoài phạm vi: submissions, upload, Storage, AI, wallet, Solana, Anchor, SPL Token, funding, settlement, receipt, admin dashboard, deployment.

## Nguyên tắc bảo mật

- Actor lấy từ verified session và `auth.uid()`.
- Role lấy từ `public.profiles.role`.
- Không nhận `client_id`, `assigned_worker_id`, role hoặc status từ form.
- Không dùng admin client hoặc `SUPABASE_SECRET_KEY` trong user flow.
- Không dùng Client Component làm authorization boundary.
- Không trả raw provider/SQL error, token, cookie, secret hoặc stack trace.
- Default deny.

## Status model

`DRAFT`, `TERMS_LOCKED`, `OPEN`, `CLAIMED`, `CANCELLED`.

Transition hợp lệ:

- `DRAFT -> TERMS_LOCKED`
- `TERMS_LOCKED -> OPEN`
- `OPEN -> CLAIMED`
- `DRAFT -> CANCELLED`
- `TERMS_LOCKED -> CANCELLED`
- `OPEN -> CANCELLED`

Mọi transition khác bị từ chối. Không tạo generic `targetStatus` mutation.

## `public.gigs`

Fields:

- `id uuid primary key default gen_random_uuid()`
- `client_id uuid not null references public.profiles(id) on delete restrict`
- `assigned_worker_id uuid null references public.profiles(id) on delete restrict`
- `title text not null`
- `description text not null`
- `category text not null`
- `deliverables text not null`
- `budget_atomic bigint not null`
- `token_mint text null`
- `deadline timestamptz not null`
- `revision_allowance integer not null default 1`
- `required_skills text[] not null default '{}'`
- `status text not null default 'DRAFT'`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraints:

- title trim 5..120;
- description trim >=20;
- category trim 2..60;
- deliverables trim >=10;
- `budget_atomic > 0`;
- revision allowance 0..10;
- status allowlist;
- assigned worker khác client;
- `CLAIMED` bắt buộc có worker;
- status khác `CLAIMED` bắt buộc worker null;
- không hard delete.

Indexes: `client_id`, `assigned_worker_id`, `status`, `created_at desc`, `(status, deadline)`.

Tạo trigger database cập nhật `updated_at`.

## `public.license_terms`

Fields:

- `id uuid primary key default gen_random_uuid()`
- `gig_id uuid not null references public.gigs(id) on delete cascade`
- `version integer not null`
- `license_type text not null`
- `terms_text text not null`
- `terms_hash text null`
- `locked_at timestamptz null`
- `created_at timestamptz not null default now()`

Constraints:

- version >0;
- unique `(gig_id, version)`;
- license type: `NON_EXCLUSIVE|EXCLUSIVE|LIMITED_USE`;
- terms text trim >=20;
- hash null hoặc lowercase SHA-256 hex 64 ký tự;
- hash và locked_at cùng null hoặc cùng có giá trị;
- UI chỉ tạo version 1;
- browser không gửi hash/locked_at.

Tạo trigger: cho phép khóa lần đầu; sau khi `old.locked_at` tồn tại thì từ chối UPDATE và DELETE.

## Terms hash

Canonical input, thứ tự cố định:

```text
gig_id=<UUID>
version=<INTEGER>
license_type=<VALUE>
terms_text=<NORMALIZED_TEXT>
```

Normalize bằng trim và đổi CRLF/CR thành LF. Không timestamp, random, email, display name hoặc locale transform.

Dùng SHA-256 thật, lowercase hex 64 ký tự. Ưu tiên RPC tự tính trong transaction bằng `pgcrypto`; browser/Server Action không gửi hash. Không tuyên bố on-chain hoặc bằng chứng pháp lý tuyệt đối.

## Budget

UI dùng “Đơn vị thử nghiệm”. Form chỉ nhận chuỗi số nguyên dương. Parse `BigInt`, lưu `bigint`, upper bound `9223372036854775807`. Reject rỗng, 0, âm, decimal, scientific notation, dấu cộng, ký tự và overflow. Không ghi USDC/SOL. `token_mint` luôn null trong TASK-002C.

## RPC nguyên tử

Tạo:

1. `create_draft_gig_with_terms`: require CLIENT; actor từ `auth.uid()`; insert gig DRAFT + terms v1 trong cùng transaction; rollback toàn bộ khi lỗi.
2. `update_draft_gig`: require CLIENT owner và DRAFT; chỉ field editable; terms v1 chưa khóa; transaction-safe.
3. `lock_gig_terms`: require CLIENT owner và DRAFT; lock rows; tính hash từ dữ liệu DB; ghi hash/locked_at; chuyển TERMS_LOCKED trong cùng transaction.
4. `open_gig`: require CLIENT owner, TERMS_LOCKED, hash+locked_at, worker null; chuyển OPEN.
5. `claim_gig`: require WORKER; conditional atomic update khi OPEN, worker null, actor khác client và terms đã khóa; set worker + CLAIMED. Hai request đồng thời chỉ một thành công, request còn lại nhận conflict.
6. `cancel_gig`: require CLIENT owner; chỉ DRAFT/TERMS_LOCKED/OPEN; worker null; chuyển CANCELLED, không xóa.

Ưu tiên `security definer` vì không grant mutation trực tiếp: `set search_path=''`, fully-qualified identifiers, tự kiểm tra `auth.uid()`/role/owner/state, revoke execute từ PUBLIC và anon, grant cho authenticated.

## RLS

### gigs

- RLS enabled, anonymous không quyền.
- CLIENT đọc own gigs.
- WORKER đọc OPEN gigs và gigs assigned cho chính mình.
- Không direct broad insert/update/delete; mutation qua RPC.
- Không policy `using(true)`.

### license_terms

- RLS enabled, anonymous không quyền.
- CLIENT đọc terms của own gig.
- WORKER đọc terms khi gig OPEN hoặc assigned cho mình.
- Không direct insert/update/delete; mutation qua RPC.

## Kiến trúc ứng dụng

Server Components cho reads, Server Actions cho mutations, service/repository gọi RPC.

```text
UI -> Server Action -> Zod -> authenticated context -> role/ownership -> service -> repository/RPC -> RLS -> constraints/triggers
```

Không nhồi business logic vào Page/Action. Không dùng admin client.

## Input và result

Create input chỉ có: title, description, category, deliverables, budget, deadline, revisionAllowance, requiredSkills, licenseType, termsText.

Không nhận actor/system fields, status, hash hoặc lockedAt.

Action result chỉ có: success, entityId, fieldErrors, formError, redirectPath. Domain errors an toàn bằng tiếng Việt.

## Routes/UI

CLIENT:

- `/client/cong-viec`
- `/client/cong-viec/tao-moi`
- `/client/cong-viec/[gigId]`
- `/client/cong-viec/[gigId]/chinh-sua`

WORKER:

- `/worker/cong-viec`
- `/worker/cong-viec/[gigId]`

Server-side role authorization bắt buộc.

Client dashboard dùng data thật: tổng, DRAFT, TERMS_LOCKED, OPEN, CLAIMED, recent.

Actions theo state:

- DRAFT: edit, lock, cancel.
- TERMS_LOCKED: open, cancel.
- OPEN: cancel nếu chưa worker.
- CLAIMED/CANCELLED: read-only.

Worker browse chỉ OPEN; detail có terms và claim. Không hiển thị email client.

Disclosure: môi trường thử nghiệm, dữ liệu lưu thật trong Supabase, không tiền thật, chưa blockchain/escrow. Không gọi backend data là simulated.

## File plan

Có thể tạo `src/lib/gigs/**`, `src/app/actions/gigs.ts`, `src/components/gigs/**`, các routes client/worker nêu trên, unit tests và đúng một migration timestamp mới.

Có thể sửa dashboard/AppShell/docs. Không sửa `.env.local`, package manifests, migrations đã áp dụng, AGENTS/DESIGN/.agents/docs decisions/architecture/product.

## Migration

Tạo đúng một file:

`supabase/migrations/<timestamp>_create_gigs_license_terms_and_rpc.sql`

Không sửa migration cũ. Không login/link/db push/apply hosted migration trong implementation phase. Dừng để review SQL.

## Unit tests

Pure tests cho schemas, budget, transitions, role/owner authorization, self-claim rejection, canonicalization/hash, domain errors và safe result. Không thêm dependency, jsdom, Testing Library hoặc fake integration tests.

## Runtime/RLS verification sau apply

- Anonymous không đọc/mutate.
- CLIENT tạo/read/edit DRAFT/lock/open/cancel own gig; không claim.
- WORKER browse OPEN/read terms/claim/read assigned; không create hoặc claim invalid state.
- Hai WORKER claim cùng gig: chỉ một thành công.
- Locked terms không update/delete; hash đúng 64 lowercase hex.
- Chỉ tuyên bố PASS sau xác minh thật.

## Documentation

Cập nhật README và docs database/api/security/workflows/testing/tasks. Ghi rõ data thật trên test environment, budget test unit, hash chưa on-chain, chưa Storage/submission/funding/blockchain/settlement/receipt.

## Verification

Chạy tuần tự:

1. `npm run lint`
2. `npm run typecheck`
3. `npm run test`
4. `npm run build`

Không install/uninstall, `technical:check`, Supabase login/link/push hoặc integration test trước migration.

## Required response before implementation

Phản hồi đầu tiên chỉ:

1. Xác nhận đọc EOF.
2. Audit source/migrations.
3. Schema/constraints/indexes.
4. Transition matrix.
5. RLS.
6. Sáu RPC và concurrency.
7. Budget/hash.
8. Architecture/Server Actions/routes/UI.
9. Exact file plan.
10. Migration plan.
11. Acceptance criteria.
12. Unit/runtime/RLS tests.
13. Commands.
14. Dừng review.

Không sửa/tạo/xóa file, không tạo migration, không chạy command thay đổi repository, không apply Supabase.
