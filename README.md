# 🚀 Micro-Gig Network

Micro-Gig Network là một nền tảng phi tập trung (Decentralized Platform) kết nối các Indie Game Studio (Client) và các nhà sáng tạo nội dung, sinh viên, người làm việc tự do (Worker) thông qua mô hình tiểu công việc (Micro-gigs). 

Dự án chú trọng tính minh bạch, uy tín và sự công bằng thông qua việc tích hợp Smart Contract trên hệ sinh thái **Solana**, bảo vệ quyền lợi của cả người thuê và người làm việc bằng cơ chế **Escrow (Ký quỹ)** và **Arbiter (Phân xử)** tự động.

---

## 🌟 Tính năng nổi bật (Features)

*   **🔒 Ký quỹ an toàn (Smart Contract Escrow):** Client sau khi thống nhất điều khoản sẽ nạp tiền (Token SOL - Devnet) vào két sắt trung gian (Vault PDA) được quản lý bởi Hợp đồng thông minh Anchor.
*   **🤝 Giải ngân tự động:** Ngay khi Client bấm nghiệm thu (Approve), tiền từ két sắt sẽ tự động chuyển thẳng vào ví của Worker mà không qua sự can thiệp của bất kỳ ai.
*   **⚖️ Hệ thống phân xử (Dispute Resolution):** Trong trường hợp xảy ra tranh chấp, Admin (Arbiter) có quyền phân định để bảo vệ lẽ phải, chia lại tỷ lệ tiền thưởng cho Client hoặc Worker hợp lý.
*   **🔐 Quản lý danh tính & Vai trò (RBAC):** Tích hợp Supabase Auth với cơ chế phân quyền rõ ràng (Client / Worker).
*   **🎨 Giao diện 3D mượt mà:** Trải nghiệm người dùng cao cấp với thư viện `framer-motion`, các hiệu ứng thẻ 3D nghiêng theo trỏ chuột, tạo cảm giác chuyên nghiệp và uy tín.
*   **⏰ Cron Job tích hợp:** Luôn giữ hệ thống ở trạng thái hoạt động tốt nhất thông qua cơ chế Vercel Cron kiểm tra sức khoẻ tự động mỗi 5 phút.

---

## 🛠 Tech Stack (Công nghệ sử dụng)

*   **Frontend & Core API:** Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Shadcn UI.
*   **Database & Auth:** Supabase (PostgreSQL, Row Level Security - RLS).
*   **Blockchain:** Solana Devnet.
*   **Smart Contract:** Rust, Anchor Framework.
*   **Web3 Client:** `@solana/web3.js`, `@solana/kit`, Wallet Adapter (Phantom, Solflare).

---

## 🚀 Hướng dẫn cài đặt (Local Development)

### 1. Yêu cầu hệ thống (Prerequisites)
*   Node.js (>= 18.x)
*   Rust & Cargo (để build Smart Contract)
*   Solana CLI (dùng để test và deploy hợp đồng)
*   Tài khoản Supabase (để tạo Database)

### 2. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 3. Cấu hình biến môi trường
Tạo file `.env.local` ở thư mục gốc và cung cấp các thông số sau (Lấy từ Supabase):
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_SOLANA_DEVNET_RPC_URL=https://api.devnet.solana.com
```

### 4. Thiết lập Database (Supabase)
Chạy các file script có trong thư mục `supabase/migrations` vào SQL Editor của Supabase để khởi tạo bảng `gigs`, `profiles`, và cấu hình RLS bảo mật.

### 5. Biên dịch Hợp đồng thông minh (Escrow Contract)
```bash
npm run escrow:build
```
*(Yêu cầu máy phải có môi trường Rust/Solana chuẩn hoặc dùng Docker)*

### 6. Chạy dự án Frontend
```bash
npm run dev
```
Truy cập ứng dụng tại `http://localhost:3000`.

---

## 🚢 Hướng dẫn triển khai (Deploy)

### Frontend & API (Vercel)
Dự án được tối ưu 100% để chạy trên nền tảng **Vercel**:
1. Đẩy code lên GitHub repository của bạn.
2. Đăng nhập Vercel, chọn **Import Project**.
3. Cấu hình các biến môi trường (`NEXT_PUBLIC_SUPABASE_URL`, v.v.) trong phần Environment Variables.
4. Nhấn **Deploy**. Vercel sẽ tự động cấu hình Serverless Functions cho các API và nhận diện tệp `vercel.json` để chạy Cron Jobs.

---

## 📝 Quy trình một công việc (Gig Workflow)

1. **Khởi tạo:** Client tạo công việc (DRAFT).
2. **Khoá điều khoản:** Hai bên đồng ý điều khoản (TERMS_LOCKED).
3. **Nạp tiền (Fund):** Client gọi lệnh nạp SOL vào két sắt Vault thông qua ví Phantom. Hệ thống ghi nhận trạng thái FUNDED.
4. **Làm việc:** Worker bắt đầu làm và sau đó nộp sản phẩm (SUBMITTED).
5. **Nghiệm thu (Approve):** Client kiểm tra và bấm "Nghiệm thu". Smart Contract giải ngân ngay lập tức cho Worker. Trạng thái chuyển thành SETTLED/RELEASED.
6. **Tranh chấp (Tùy chọn):** Nếu có sự cố, trạng thái chuyển thành DISPUTED. Admin sẽ dùng quyền để đưa ra phán quyết cuối cùng (Resolve).

---

## 📜 Giấy phép (License)
Dự án được phát triển trong khuôn khổ Unihackfest 2026. Mọi quyền liên quan thuộc về đội ngũ phát triển.
