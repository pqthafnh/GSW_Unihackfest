TASK-002C Implementation Approval
Kế hoạch trong phản hồi audit được phê duyệt có điều kiện.

Chỉ triển khai TASK-002C trong phase này.

Không triển khai bất kỳ source, migration, Storage policy hoặc UI nào của TASK-002D.

Phạm vi được phép
Triển khai:

public.gigs;
public.license_terms;
constraints;
indexes;
updated_at trigger;
locked terms immutability trigger;
RLS;
create_draft_gig_with_terms;
update_draft_gig;
lock_gig_terms;
open_gig;
claim_gig;
cancel_gig;
gig domain modules;
repository và service;
Server Actions;
Client gig routes;
Worker gig routes;
authenticated dashboards dùng dữ liệu Supabase thật;
pure unit tests;
documentation TASK-002C.
Không triển khai:

public.submissions;
private Storage bucket;
Storage policies;
uploads;
signed URLs;
submission versioning;
revision request;
payment;
funding;
Solana;
Anchor;
settlement;
receipt;
TASK-002D migration.
Migration
Tạo đúng một migration forward-only:

supabase/migrations/_create_gigs_license_terms_and_rpc.sql

Timestamp phải mới hơn migration TASK-002B.

Không sửa:

20260922220000_create_system_health_checks.sql
20260923080000_create_profiles_and_auth_trigger.sql
Không apply migration lên hosted Supabase.

Không login, link hoặc db push.

RPC security
Mutation RPC sử dụng security definer.

Mỗi function phải:

set search_path = '';
dùng fully-qualified names;
lấy actor từ auth.uid();
reject anonymous;
đọc role từ public.profiles;
kiểm tra role;
kiểm tra ownership;
kiểm tra current state;
revoke execute từ PUBLIC;
revoke execute từ anon;
grant execute cho authenticated.
Không grant direct insert, update hoặc delete rộng trên:

public.gigs;
public.license_terms.
Không dùng admin client hoặc SUPABASE_SECRET_KEY trong user-facing workflow.

Terms hash
Database RPC là source of truth duy nhất cho terms hash.

Migration được phép khai báo:

create extension if not exists pgcrypto;

lock_gig_terms phải:

Lock gig và terms rows.
Require CLIENT owner.
Require gig DRAFT.
Require terms version 1 chưa khóa.
Đọc dữ liệu canonical từ database.
Normalize CRLF và CR thành LF.
Trim terms text.
Tạo canonical string theo thứ tự cố định:
gig_id
version
license_type
terms_text
Tính SHA-256 bằng pgcrypto.
Encode lowercase hexadecimal.
Ghi terms_hash.
Ghi locked_at bằng database time.
Chuyển gig thành TERMS_LOCKED.
Thực hiện trong cùng transaction.
Browser và Server Action không nhận hoặc gửi terms_hash.

Không triển khai quy tắc hash thứ hai trong application code.

Unit test TypeScript chỉ kiểm tra canonicalization contract nếu cần, không dùng kết quả TypeScript làm source of truth cho dữ liệu được khóa.

token_mint
TASK-002C chưa có token thật.

Do đó:

form không có token_mint;
Server Action không nhận token_mint;
RPC create không nhận token_mint;
gig mới luôn có token_mint = null;
UI dùng nhãn “Đơn vị thử nghiệm”;
không hiển thị USDC hoặc SOL.
Claim concurrency
claim_gig phải thực hiện conditional atomic update trong database.

Điều kiện tối thiểu:

actor có role WORKER;
gig status OPEN;
assigned_worker_id is null;
client_id khác auth.uid();
locked terms version 1 tồn tại;
terms_hash và locked_at tồn tại.
Operation phải cập nhật cùng lúc:

assigned_worker_id = auth.uid();
status = CLAIMED.
Chỉ một concurrent request được thành công.

Request thua race phải được map thành domain conflict:

“Công việc đã có Cộng tác viên nhận”.

Không dùng select rồi update không điều kiện.

Domain contract
Tạo domain riêng trong src/lib/gigs.

Không xóa hoặc đổi contract toàn hệ thống dành cho các task tương lai.

Chỉ sửa src/contracts/index.ts nếu có import thực tế gây xung đột, và phải giải thích trong final report.

Reads và mutations
Dùng:

Server Components cho reads;
Server Actions cho mutations;
repository/service/RPC boundary;
session-aware Supabase server client.
Không tạo Route Handler song song nếu không cần.

Không dùng admin client.

UI
Authenticated dashboard phải dùng dữ liệu gig thật từ Supabase.

Không dùng DEMO_GIGS làm nguồn chính trong:

/client
/worker
các route công việc.
Static data chỉ được giữ cho marketing preview nếu ghi rõ là minh họa.

Toàn bộ nội dung mới bằng tiếng Việt.

Phải hiển thị disclosure:

Môi trường thử nghiệm.
Dữ liệu được lưu thật trong Supabase.
Không sử dụng tiền thật.
Chưa có giao dịch blockchain.
Chưa có ký quỹ on-chain.
Tests
Tạo pure unit tests TASK-002C.

Không tạo fake integration tests.

Không thêm jsdom hoặc Testing Library.

Không tuyên bố RLS hoặc concurrency PASS trước khi migration được apply và runtime verification thật được thực hiện.

Files bị cấm
Không sửa:

.env.local
AGENTS.md
DESIGN.md
.agents/**
docs/decisions/**
docs/architecture.md
docs/product.md
package.json
package-lock.json
migrations đã tồn tại
Không thêm dependency.

Verification
Chạy tuần tự:

npm run lint
npm run typecheck
npm run test
npm run build
Không chạy:

npm install
npm uninstall
npm run technical:check
supabase login
supabase link
supabase db push
hosted migration
integration tests trước migration
Final report
Báo:

Files created.
Files modified.
Migration filename.
Schema gigs.
Schema license_terms.
Constraints và indexes.
RLS policies.
RPC security model.
Sáu RPC operations.
Claim concurrency implementation.
Terms hash implementation.
Client routes.
Worker routes.
Static demo data còn được dùng ở đâu.
Unit test result.
Lint result.
Typecheck result.
Build result.
Remaining manual actions.
Dừng sau code, migration và static verification.

Không apply migration