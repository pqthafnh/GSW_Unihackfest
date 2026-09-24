"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatValidationErrors, loginSchema, signupSchema } from "@/lib/auth/validation";
import { safeRoleRedirect } from "@/lib/auth/redirect";

export interface AuthActionState {
  error?: string;
  fieldErrors?: Record<string, string>;
  confirmation?: boolean;
}

function safeAuthError(): AuthActionState {
  return { error: "Không thể hoàn tất yêu cầu. Vui lòng kiểm tra thông tin và thử lại." };
}

export async function signupAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = signupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: formatValidationErrors(parsed.error) };
  const client = await createSupabaseServerClient();
  if (!client) return { error: "Hệ thống xác thực chưa được cấu hình." };
  const { data, error } = await client.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { display_name: parsed.data.displayName, requested_role: parsed.data.role } },
  });
  if (error || !data.user) return safeAuthError();
  if (!data.session) redirect("/xac-nhan-tai-khoan");
  const { data: profile } = await client.from("profiles").select("role").eq("id", data.user.id).single<{ role: "CLIENT" | "WORKER" | "ADMIN" }>();
  if (!profile || profile.role === "ADMIN") return { error: "Tài khoản chưa có vai trò hợp lệ." };
  redirect(safeRoleRedirect(profile.role, null));
}

export async function loginAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: formatValidationErrors(parsed.error) };
  const client = await createSupabaseServerClient();
  if (!client) return { error: "Hệ thống xác thực chưa được cấu hình." };
  const { data, error } = await client.auth.signInWithPassword(parsed.data);
  if (error || !data.user) return safeAuthError();
  const { data: profile } = await client.from("profiles").select("role").eq("id", data.user.id).single<{ role: "CLIENT" | "WORKER" | "ADMIN" }>();
  if (!profile || profile.role === "ADMIN") return { error: "Tài khoản chưa được cấp quyền truy cập workspace." };
  const next = typeof formData.get("next") === "string" ? formData.get("next") as string : null;
  redirect(safeRoleRedirect(profile.role, next));
}

export async function logoutAction() {
  const client = await createSupabaseServerClient();
  if (client) await client.auth.signOut();
  redirect("/dang-nhap");
}
