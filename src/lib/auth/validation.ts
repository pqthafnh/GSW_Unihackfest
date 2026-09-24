import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().trim().email("Vui lòng nhập email hợp lệ."),
  password: z.string().min(8, "Mật khẩu cần ít nhất 8 ký tự."),
  confirmPassword: z.string(),
  displayName: z.string().trim().min(2, "Tên hiển thị cần ít nhất 2 ký tự.").max(80, "Tên hiển thị tối đa 80 ký tự."),
  role: z.enum(["CLIENT", "WORKER"], { errorMap: () => ({ message: "Vui lòng chọn vai trò hợp lệ." }) }),
}).superRefine((value, context) => {
  if (value.password !== value.confirmPassword) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["confirmPassword"], message: "Mật khẩu xác nhận không khớp." });
  }
});

export const loginSchema = z.object({
  email: z.string().trim().email("Vui lòng nhập email hợp lệ."),
  password: z.string().min(1, "Vui lòng nhập mật khẩu."),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export function formatValidationErrors(error: z.ZodError): Record<string, string> {
  return error.flatten().fieldErrors
    ? Object.fromEntries(Object.entries(error.flatten().fieldErrors).map(([key, messages]) => [key, messages?.[0] ?? "Giá trị không hợp lệ."]))
    : {};
}
