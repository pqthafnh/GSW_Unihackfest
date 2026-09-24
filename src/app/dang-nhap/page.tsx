import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import { AuthForm } from "@/components/auth/auth-form";
import { SurfaceCard } from "@/components/ui/surface-card";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams;
  return <main className="flex min-h-[calc(100vh-40px)] items-center justify-center bg-[#f5f5f7] px-6 py-12"><SurfaceCard className="w-full max-w-md p-7 sm:p-9"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0066cc]">Micro-Gig Network</p><h1 className="mt-3 text-3xl font-semibold">Đăng nhập</h1><p className="mt-3 text-sm leading-6 text-neutral-600">Đăng nhập bằng tài khoản Supabase thật để mở workspace.</p><div className="mt-8"><AuthForm mode="login" action={loginAction} next={params.next} /></div><p className="mt-6 text-center text-sm text-neutral-600">Chưa có tài khoản? <Link href="/dang-ky" className="font-semibold text-[#0066cc]">Đăng ký</Link></p></SurfaceCard></main>;
}
