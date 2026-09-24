"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { formatGigErrors, gigInputSchema } from "@/lib/gigs/validation";
import { createGigService, mutateGigService, updateGigService } from "@/lib/gigs/service";
import { CLAIM_CONFLICT_MESSAGE, isClaimConflict } from "@/lib/gigs/state";
export interface GigActionState { fieldErrors?: Record<string,string>; formError?: string; success?: boolean; entityId?: string; }
function input(formData: FormData) { return gigInputSchema.safeParse(Object.fromEntries(formData)); }
export async function createGigAction(
  _: GigActionState,
  formData: FormData,
): Promise<GigActionState> {
  const parsed = input(formData);

  if (!parsed.success) {
    const fieldErrors = formatGigErrors(parsed.error);

    console.error("Create gig validation failed", {
      issues: parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });

    return {
      fieldErrors,
      formError: "Vui lòng kiểm tra lại các trường thông tin.",
    };
  }

  let gigId: string;

  try {
    const result = await createGigService(parsed.data);

    if (result.error) {
      console.error("Create gig RPC failed", {
        code: result.error.code,
        message: result.error.message,
        details: result.error.details,
        hint: result.error.hint,
      });

      return {
        formError: "Không thể tạo công việc. Vui lòng thử lại.",
      };
    }

    if (!result.data) {
      console.error("Create gig RPC returned no ID");

      return {
        formError: "Không thể xác nhận công việc vừa tạo.",
      };
    }

    gigId = String(result.data);
  } catch (error) {
    console.error("Create gig action failed", {
      message:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return {
      formError: "Không thể tạo công việc. Vui lòng thử lại.",
    };
  }

  revalidatePath("/client");
  revalidatePath("/client/cong-viec");

  redirect(`/client/cong-viec/${gigId}`);
}
export async function updateGigAction(_: GigActionState, formData: FormData): Promise<GigActionState> {
  const id = String(formData.get("gigId") || ""); const parsed = input(formData); if (!parsed.success) return { fieldErrors: formatGigErrors(parsed.error) };
  try { const { error } = await updateGigService(id, parsed.data); if (error) return { formError: "Không thể cập nhật công việc." }; revalidatePath(`/client/cong-viec/${id}`); return { success: true, entityId: id }; } catch { return { formError: "Không thể cập nhật công việc." }; }
}
export async function gigMutationAction(formData: FormData) {
  const id = String(formData.get("gigId") || ""); const operation = String(formData.get("operation") || "");
  const allowed = ["lock_gig_terms","open_gig","cancel_gig"]; if (!allowed.includes(operation)) return;
  try { await mutateGigService(operation as "lock_gig_terms"|"open_gig"|"cancel_gig", id, "CLIENT"); revalidatePath("/client"); revalidatePath(`/client/cong-viec/${id}`); } catch { /* safe UI remains unchanged */ }
}
export async function claimGigAction(_: GigActionState, formData: FormData): Promise<GigActionState> {
  const id = String(formData.get("gigId") || "");
  try {
    const result = await mutateGigService("claim_gig", id, "WORKER");
    if (result.error) return { formError: isClaimConflict(result.error.message) ? CLAIM_CONFLICT_MESSAGE : "Không thể nhận công việc." };
    revalidatePath("/worker");
    revalidatePath(`/worker/cong-viec/${id}`);
    return { success: true };
  } catch {
    return { formError: "Không thể nhận công việc." };
  }
}
