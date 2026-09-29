"use client";

import { useActionState } from "react";
import { createGigAction, updateGigAction, type GigActionState } from "@/app/actions/gigs";
import type { Gig } from "@/lib/gigs/types";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Button } from "@/components/ui/button";

export function GigForm({ gig }: { gig?: Gig }) {
  const action = gig ? updateGigAction : createGigAction; 
  const [state, formAction, pending] = useActionState<GigActionState, FormData>(action, {});
  const terms = gig?.license_terms && !Array.isArray(gig.license_terms) ? gig.license_terms : undefined;

  const inputClass = "mt-2 block w-full rounded-xl border border-black/10 bg-white/50 px-4 py-3 text-sm focus:border-[#0066cc] focus:outline-none focus:ring-1 focus:ring-[#0066cc] transition-colors";

  return (
    <form action={formAction} className="space-y-8">
      {gig && <input type="hidden" name="gigId" value={gig.id} />}
      
      <SurfaceCard className="p-6 md:p-8 space-y-6" elevation="raised-xs">
        <div>
          <h3 className="text-lg font-semibold text-[#1d1d1f] mb-4">Thông tin cơ bản</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <label className="block text-sm font-medium text-neutral-700">
              Tiêu đề
              <input required name="title" defaultValue={gig?.title} className={inputClass} placeholder="VD: Gói Localization tiếng Nhật" />
              <FieldError message={state.fieldErrors?.title} />
            </label>
            <label className="block text-sm font-medium text-neutral-700">
              Danh mục
              <input required name="category" defaultValue={gig?.category} className={inputClass} placeholder="VD: Dịch thuật" />
              <FieldError message={state.fieldErrors?.category} />
            </label>
            <label className="block text-sm font-medium text-neutral-700">
              Ngân sách (đơn vị thử nghiệm)
              <input required name="budgetAtomic" type="number" defaultValue={gig?.budget_atomic} className={inputClass} placeholder="VD: 500" />
              <FieldError message={state.fieldErrors?.budgetAtomic} />
            </label>
            <label className="block text-sm font-medium text-neutral-700">
              Hạn chót
              <input required name="deadline" type="datetime-local" defaultValue={gig?.deadline?.slice(0,16)} className={inputClass} />
              <FieldError message={state.fieldErrors?.deadline} />
            </label>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard className="p-6 md:p-8 space-y-6" elevation="raised-xs">
        <div>
          <h3 className="text-lg font-semibold text-[#1d1d1f] mb-4">Chi tiết yêu cầu</h3>
          <div className="space-y-6">
            <label className="block text-sm font-medium text-neutral-700">
              Mô tả chi tiết
              <textarea required name="description" defaultValue={gig?.description} className={`${inputClass} min-h-32 resize-y`} placeholder="Mô tả cụ thể công việc cần làm..." />
              <FieldError message={state.fieldErrors?.description} />
            </label>
            <label className="block text-sm font-medium text-neutral-700">
              Sản phẩm bàn giao
              <textarea required name="deliverables" defaultValue={gig?.deliverables} className={`${inputClass} min-h-24 resize-y`} placeholder="Yêu cầu cụ thể về file giao nộp..." />
              <FieldError message={state.fieldErrors?.deliverables} />
            </label>
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block text-sm font-medium text-neutral-700">
                Kỹ năng (phân cách bằng dấu phẩy)
                <input name="requiredSkills" defaultValue={gig?.required_skills.join(", ")} className={inputClass} placeholder="VD: Japanese, Translation, Gaming" />
                <FieldError message={state.fieldErrors?.requiredSkills} />
              </label>
              <label className="block text-sm font-medium text-neutral-700">
                Số lần chỉnh sửa
                <input name="revisionAllowance" type="number" min="0" max="10" defaultValue={gig?.revision_allowance ?? 1} className={inputClass} />
                <FieldError message={state.fieldErrors?.revisionAllowance} />
              </label>
            </div>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard className="p-6 md:p-8 space-y-6" elevation="raised-xs">
        <div>
          <h3 className="text-lg font-semibold text-[#1d1d1f] mb-4">Bản quyền & Điều khoản</h3>
          <div className="space-y-6">
            <label className="block text-sm font-medium text-neutral-700">
              Loại giấy phép
              <select name="licenseType" defaultValue={terms?.license_type ?? "NON_EXCLUSIVE"} className={inputClass}>
                <option value="NON_EXCLUSIVE">Không độc quyền</option>
                <option value="EXCLUSIVE">Độc quyền</option>
                <option value="LIMITED_USE">Sử dụng giới hạn</option>
              </select>
              <FieldError message={state.fieldErrors?.licenseType} />
            </label>
            <label className="block text-sm font-medium text-neutral-700">
              Điều khoản cụ thể
              <textarea required name="termsText" defaultValue={terms?.terms_text} className={`${inputClass} min-h-32 resize-y`} placeholder="Quy định rõ về quyền sử dụng, phạm vi..." />
              <FieldError message={state.fieldErrors?.termsText} />
            </label>
          </div>
        </div>
      </SurfaceCard>

      {state.formError && (
        <div className="rounded-xl bg-red-50 p-4 border border-red-100">
          <p className="text-sm font-medium text-red-800">{state.formError}</p>
        </div>
      )}
      
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={pending} size="lg" className="px-10">
          {pending ? "Đang xử lý..." : gig ? "Cập nhật công việc" : "Tạo công việc"}
        </Button>
      </div>
    </form>
  );
}

function FieldError({
  message,
}: {
  message?: string;
}) {
  if (!message) {
    return null;
  }

  return (
    <span className="mt-1 block text-xs text-red-600">
      {message}
    </span>
  );
}
