"use client";
import { useActionState } from "react";
import { createGigAction, updateGigAction, type GigActionState } from "@/app/actions/gigs";
import type { Gig } from "@/lib/gigs/types";
export function GigForm({ gig }: { gig?: Gig }) {
  const action = gig ? updateGigAction : createGigAction; const [state, formAction, pending] = useActionState<GigActionState, FormData>(action, {});
  const terms = gig?.license_terms && !Array.isArray(gig.license_terms) ? gig.license_terms : undefined;
  return <form action={formAction} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
    {gig && <input type="hidden" name="gigId" value={gig.id} />}
    {([["title","Tiêu đề",gig?.title],["category","Danh mục",gig?.category],["budgetAtomic","Ngân sách (đơn vị thử nghiệm)",gig?.budget_atomic],["deadline","Hạn chót",gig?.deadline?.slice(0,16)]] as const).map(([name,label,value]) => <label key={name} className="block text-sm font-medium">{label}<input required name={name} defaultValue={value} type={name==="deadline"?"datetime-local":"text"} className="mt-1 block min-h-11 w-full rounded-lg border p-2" />{state.fieldErrors?.[name] && <FieldError message={state.fieldErrors[name]} />}</label>)}
    <label className="block text-sm font-medium">Mô tả<textarea required name="description" defaultValue={gig?.description} className="mt-1 block min-h-24 w-full rounded-lg border p-2"/><FieldError message={state.fieldErrors?.description} /></label>
    <label className="block text-sm font-medium">Sản phẩm bàn giao<textarea required name="deliverables" defaultValue={gig?.deliverables} className="mt-1 block min-h-20 w-full rounded-lg border p-2"/><FieldError message={state.fieldErrors?.deliverables} /></label>
    <label className="block text-sm font-medium">Kỹ năng (phân cách bằng dấu phẩy)<input name="requiredSkills" defaultValue={gig?.required_skills.join(", ")} className="mt-1 block min-h-11 w-full rounded-lg border p-2"/><FieldError message={state.fieldErrors?.requiredSkills} /></label>
    <label className="block text-sm font-medium">Số lần chỉnh sửa<input name="revisionAllowance" type="number" min="0" max="10" defaultValue={gig?.revision_allowance ?? 1} className="mt-1 block min-h-11 w-full rounded-lg border p-2"/><FieldError message={state.fieldErrors?.revisionAllowance} /></label>
    <label className="block text-sm font-medium">Loại giấy phép<select name="licenseType" defaultValue={terms?.license_type ?? "NON_EXCLUSIVE"}className="mt-1 block min-h-11 w-full rounded-lg border p-2">
    <option value="NON_EXCLUSIVE">Không độc quyền</option>
    <option value="EXCLUSIVE">Độc quyền</option>
    <option value="LIMITED_USE">Sử dụng giới hạn</option>
  </select>
  <FieldError message={state.fieldErrors?.licenseType} />
</label>
    <label className="block text-sm font-medium">Điều khoản<textarea required name="termsText" defaultValue={terms?.terms_text} className="mt-1 block min-h-32 w-full rounded-lg border p-2"/><FieldError message={state.fieldErrors?.termsText} /></label>
    {state.formError && <p className="text-sm text-red-600">{state.formError}</p>}<button disabled={pending} className="rounded-full bg-[#0066cc] px-5 py-3 font-semibold text-white disabled:opacity-50">{pending ? "Đang lưu..." : gig ? "Lưu bản nháp" : "Tạo công việc"}</button>
  </form>;
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
}
