import Link from "next/link";
import { signupAction } from "@/app/actions/auth";
import { AuthForm } from "@/components/auth/auth-form";
import { SurfaceCard } from "@/components/ui/surface-card";

export default function SignupPage() {
  return <main className="flex min-h-[calc(100vh-40px)] items-center justify-center bg-[#f5f5f7] px-6 py-12"><SurfaceCard className="w-full max-w-md p-7 sm:p-9"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0066cc]">Micro-Gig Network</p><h1 className="mt-3 text-3xl font-semibold">Tạo tài khoản</h1><p className="mt-3 text-sm leading-6 text-neutral-600">Tài khoản thử nghiệm dùng Supabase Auth thật. Bạn có thể chọn CLIENT hoặc WORKER.</p><div className="mt-8"><AuthForm mode="signup" action={signupAction} /></div><p className="mt-6 text-center text-sm text-neutral-600">Đã có tài khoản? <Link href="/dang-nhap" className="font-semibold text-[#0066cc]">Đăng nhập</Link></p></SurfaceCard></main>;
}
