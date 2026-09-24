"use client";

import { useActionState } from "react";
import type { AuthActionState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

type Mode = "login" | "signup";
type AuthAction = (state: AuthActionState, formData: FormData) => Promise<AuthActionState>;

export function AuthForm({ mode, action, next }: { mode: Mode; action: AuthAction; next?: string }) {
  const [state, formAction, pending] = useActionState(action, {});
  const signup = mode === "signup";
  return (
    <form action={formAction} className="space-y-5" noValidate>
      {next && <input type="hidden" name="next" value={next} />}
      {signup && <Field name="displayName" label="Tên hiển thị" type="text" autoComplete="name" error={state.fieldErrors?.displayName} />}
      <Field name="email" label="Email" type="email" autoComplete="email" error={state.fieldErrors?.email} />
      <Field name="password" label="Mật khẩu" type="password" autoComplete={signup ? "new-password" : "current-password"} error={state.fieldErrors?.password} />
      {signup && <Field name="confirmPassword" label="Xác nhận mật khẩu" type="password" autoComplete="new-password" error={state.fieldErrors?.confirmPassword} />}
      {signup && <fieldset><legend className="mb-2 text-sm font-medium">Bạn tham gia với vai trò nào?</legend><div className="grid gap-3 sm:grid-cols-2"><label className="flex min-h-[52px] cursor-pointer items-center gap-3 rounded-xl border border-black/10 px-4 focus-within:ring-2 focus-within:ring-[#0066cc]"><input required type="radio" name="role" value="CLIENT" /><span><strong className="block text-sm">Nhà tuyển dụng</strong><span className="text-xs text-neutral-500">Tạo và quản lý brief</span></span></label><label className="flex min-h-[52px] cursor-pointer items-center gap-3 rounded-xl border border-black/10 px-4 focus-within:ring-2 focus-within:ring-[#0066cc]"><input required type="radio" name="role" value="WORKER" /><span><strong className="block text-sm">Cộng tác viên</strong><span className="text-xs text-neutral-500">Nhận và thực hiện công việc</span></span></label></div>{state.fieldErrors?.role && <p className="mt-2 text-sm text-red-700">{state.fieldErrors.role}</p>}</fieldset>}
      {state.error && <p role="alert" aria-live="polite" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{state.error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>{pending ? "Đang xử lý..." : signup ? "Tạo tài khoản" : "Đăng nhập"}</Button>
    </form>
  );
}

function Field({ name, label, type, autoComplete, error }: { name: string; label: string; type: string; autoComplete: string; error?: string }) {
  return <div><label htmlFor={name} className="mb-2 block text-sm font-medium">{label}</label><input id={name} name={name} type={type} autoComplete={autoComplete} required className="min-h-[48px] w-full rounded-xl border border-black/15 bg-white px-4 text-sm outline-none focus:border-[#0066cc] focus:ring-2 focus:ring-[#0066cc]/20" aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} />{error && <p id={`${name}-error`} className="mt-2 text-sm text-red-700">{error}</p>}</div>;
}
