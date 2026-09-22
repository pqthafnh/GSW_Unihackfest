TASK-001A: Product UI Foundation
Mandatory reading
Đọc theo thứ tự:

AGENTS.md
.agents/rules/00-core.md
.agents/rules/10-architecture.md
.agents/rules/50-frontend.md
.agents/rules/60-testing.md
docs/product.md
docs/ui.md
docs/workflows.md
DESIGN.md
Source code hiện tại trong src/
Current status
TASK-001 đã đạt:

Typecheck PASS.
16/16 unit tests PASS.
Production build PASS.
Landing page runtime PASS.
GET /api/health PASS.
Ứng dụng hiện chỉ là scaffold. Landing page chưa đủ đẹp và chưa có trải nghiệm điều hướng hữu ích.

Objective
Nâng cấp giao diện thành một premium trust-first creative marketplace cho Micro-Gig Network.

TASK-001A chỉ xây Product UI Foundation và Demo Shell.

Không tích hợp backend, database hoặc blockchain thật.

Required routes
Tạo các route:

/
/demo
/client
/worker
CTA routing
Explore Demo dẫn đến /demo.
Create a Gig dẫn đến /client.
Find Work dẫn đến /worker.
Không được có button chết.

Landing page
Landing page cần có:

Responsive global navigation.
Brand Micro-Gig Network.
Hero có CTA rõ ràng.
Product preview trực quan.
Workflow section.
Value proposition cho studio.
Value proposition cho contributor.
Trust and verification section.
Planned Technical Stack.
Footer.
Devnet và test-asset disclosure.
Planned Technical Stack
Phải hiển thị chính xác:

Solana Devnet: Configured.
Anchor Escrow: Not connected.
Private Storage: Not connected.
Metaplex Core: Not connected.
AI Review: Not connected.
Không tuyên bố integration đã connected nếu chưa có tích hợp thật.

Demo page
Tạo /demo với hai lựa chọn:

Continue as Client.
Continue as Contributor.
Hiển thị rõ:

Demo Mode.
Simulated Data.
No real funds.
No blockchain transaction is submitted.
Client dashboard shell
Tạo /client với dữ liệu demo tĩnh.

Bao gồm:

Page title.
Demo Mode badge.
Create a Gig CTA.
Summary metrics.
Recent gigs.
Submission requiring review.
Recent activity hoặc empty state.
Planned escrow status.
Responsive application navigation.
Không tạo hành động fund hoặc settlement giả.

Worker dashboard shell
Tạo /worker với dữ liệu demo tĩnh.

Bao gồm:

Page title.
Demo Mode badge.
Browse Gigs CTA.
Assigned gigs.
Upcoming deadline.
Submission status.
Demo earnings label.
Activity hoặc empty state.
Responsive application navigation.
Không tạo hành động thanh toán giả.

Reusable components
Tạo component reusable khi phù hợp:

Button.
Badge.
SurfaceCard.
StatusIndicator.
SectionHeader.
EmptyState.
DemoModeBanner.
AppShell.
MetricCard.
GigPreviewCard.
Không tạo component chỉ để bọc một thẻ HTML mà không có giá trị tái sử dụng.

Design direction
Giữ lại từ DESIGN.md:

Action Blue #0066cc.
SF Pro hoặc system typography.
Light surface.
Parchment surface.
Near-black proof surface.
Pill button grammar.
Generous whitespace.
Restrained depth.
Strong visual hierarchy.
Responsive layout.
Thích nghi thành:

Premium trust-first creative marketplace.

Không được biến giao diện thành:

Apple hardware storefront copy.
Generic admin template.
Game dashboard.
Crypto casino.
Neon Web3 interface.
Allowed visual effects
Cho phép:

Shallow card elevation.
Inset edge highlight tinh tế.
Dark verification section.
Static receipt artifact.
Static dashboard preview.
Purposeful Lucide icons nếu package đã tồn tại.
CSS transition nhẹ.
Responsive navigation.
CSS-only micro interaction.
Exclusions
Không triển khai:

Supabase.
Authentication.
Database.
Migrations.
Wallet Adapter.
Solana transaction.
Anchor.
SPL Token.
Metaplex minting.
AI provider.
WebGL.
Pointer tilt.
Parallax.
Floating animation loop.
Fake connected status.
Fake financial transaction.
Fake success state.
Deployment.
Accessibility
Bắt buộc:

Semantic landmarks.
Keyboard navigation.
Visible focus state.
Interactive target tối thiểu 44px.
Sufficient contrast.
Status không chỉ dựa vào màu sắc.
Respect reduced motion.
Responsive trên mobile, tablet và desktop.
Demo data rules
Demo data phải được ghi rõ là simulated.

Không dùng dữ liệu ngẫu nhiên.

Không dùng Date.now hoặc Math.random trong render.

Không tạo hydration mismatch.

Tests
Cần kiểm tra:

Các route render được.
CTA có href chính xác.
Demo Mode disclosure xuất hiện.
Planned Technical Stack không tuyên bố connected giả.
Toàn bộ test cũ vẫn PASS.
Không tạo fake integration test.
Documentation
Được cập nhật:

README.md.
docs/tasks.md.
Không được sửa:

AGENTS.md.
DESIGN.md.
TECHNICAL-CONNECTION-CHECK.md.
.agents/**.
docs/decisions/**.
docs/architecture.md.
docs/product.md.
doc/**.
flow/**.
Required response before implementation
Trong phản hồi tiếp theo, chỉ được:

Phân tích UX problems hiện tại.
Trình bày information architecture mới.
Liệt kê routes sẽ tạo.
Liệt kê components sẽ tạo.
Trình bày content hierarchy cho từng route.
Liệt kê exact file plan.
Phân loại file tạo mới và file sửa.
Nêu acceptance criteria.
Nêu test plan.
Nêu commands dự kiến chạy.
Sau đó dừng lại để người dùng review.

Prohibited before approval
Chưa được:

Sửa file.
Tạo file.
Xóa file.
Chạy npm install.
Chạy npm uninstall.
Thay dependency.
Triển khai code.