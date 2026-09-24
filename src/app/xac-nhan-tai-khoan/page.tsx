import Link from "next/link";

export default function ConfirmAccountPage() {
  return <main className="flex min-h-[calc(100vh-40px)] items-center justify-center bg-[#f5f5f7] px-6 py-12"><section className="w-full max-w-md rounded-2xl border border-black/[0.06] bg-white p-8 text-center shadow-sm"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0066cc]">Xác nhận tài khoản</p><h1 className="mt-4 text-3xl font-semibold">Kiểm tra email của bạn</h1><p className="mt-4 text-sm leading-6 text-neutral-600">Tài khoản đã được tạo. Hãy mở email xác nhận từ Supabase trước khi đăng nhập. Chưa có session nào được giả định.</p><Link href="/dang-nhap" className="mt-8 inline-flex min-h-[44px] items-center rounded-full bg-[#0066cc] px-5 text-sm font-semibold text-white">Đến trang đăng nhập</Link></section></main>;
}
