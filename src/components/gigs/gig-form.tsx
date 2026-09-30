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
          <h3 className="text-lg font-semibold text-[#1d1d1f] mb-4">ThÃ´ng tin cÆ¡ báº£n</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <label className="block text-sm font-medium text-neutral-700">
              TiÃªu Ä‘á»
              <input required name="title" defaultValue={gig?.title} className={inputClass} placeholder="VD: GÃ³i Localization tiáº¿ng Nháº­t" />
              <FieldError message={state.fieldErrors?.title} />
            </label>
            <label className="block text-sm font-medium text-neutral-700">
              Danh má»¥c
              <input required name="category" defaultValue={gig?.category} className={inputClass} placeholder="VD: Dá»‹ch thuáº­t" />
              <FieldError message={state.fieldErrors?.category} />
            </label>
            <label className="block text-sm font-medium text-neutral-700">
              NgÃ¢n sÃ¡ch (Ä‘Æ¡n vá»‹ thá»­ nghiá»‡m)
              <input required name="budgetAtomic" type="number" defaultValue={gig?.budget_atomic} className={inputClass} placeholder="VD: 500" />
              <FieldError message={state.fieldErrors?.budgetAtomic} />
            </label>
            <label className="block text-sm font-medium text-neutral-700">
              Háº¡n chÃ³t
              <input required name="deadline" type="datetime-local" defaultValue={gig?.deadline?.slice(0,16)} className={inputClass} />
              <FieldError message={state.fieldErrors?.deadline} />
            </label>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard className="p-6 md:p-8 space-y-6" elevation="raised-xs">
        <div>
          <h3 className="text-lg font-semibold text-[#1d1d1f] mb-4">Chi tiáº¿t yÃªu cáº§u</h3>
          <div className="space-y-6">
            <label className="block text-sm font-medium text-neutral-700">
              MÃ´ táº£ chi tiáº¿t
              <textarea required name="description" defaultValue={gig?.description} className={`${inputClass} min-h-32 resize-y`} placeholder="MÃ´ táº£ cá»¥ thá»ƒ cÃ´ng viá»‡c cáº§n lÃ m..." />
              <FieldError message={state.fieldErrors?.description} />
            </label>
            <label className="block text-sm font-medium text-neutral-700">
              Sáº£n pháº©m bÃ n giao
              <textarea required name="deliverables" defaultValue={gig?.deliverables} className={`${inputClass} min-h-24 resize-y`} placeholder="YÃªu cáº§u cá»¥ thá»ƒ vá» file giao ná»™p..." />
              <FieldError message={state.fieldErrors?.deliverables} />
            </label>
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block text-sm font-medium text-neutral-700">
                Ká»¹ nÄƒng (phÃ¢n cÃ¡ch báº±ng dáº¥u pháº©y)
                <input name="requiredSkills" defaultValue={gig?.required_skills.join(", ")} className={inputClass} placeholder="VD: Japanese, Translation, Gaming" />
                <FieldError message={state.fieldErrors?.requiredSkills} />
              </label>
              <label className="block text-sm font-medium text-neutral-700">
                Sá»‘ láº§n chá»‰nh sá»­a
                <input name="revisionAllowance" type="number" min="0" max="10" defaultValue={gig?.revision_allowance ?? 1} className={inputClass} />
                <FieldError message={state.fieldErrors?.revisionAllowance} />
              </label>
            </div>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard className="p-6 md:p-8 space-y-6" elevation="raised-xs">
        <div>
          <h3 className="text-lg font-semibold text-[#1d1d1f] mb-4">Báº£n quyá»n & Äiá»u khoáº£n</h3>
          <div className="space-y-6">
            <label className="block text-sm font-medium text-neutral-700">
              Loáº¡i giáº¥y phÃ©p
              <select name="licenseType" defaultValue={terms?.license_type ?? "NON_EXCLUSIVE"} className={inputClass}>
                <option value="NON_EXCLUSIVE">KhÃ´ng Ä‘á»™c quyá»n</option>
                <option value="EXCLUSIVE">Äá»™c quyá»n</option>
                <option value="LIMITED_USE">Sá»­ dá»¥ng giá»›i háº¡n</option>
              </select>
              <FieldError message={state.fieldErrors?.licenseType} />
            </label>
            <label className="block text-sm font-medium text-neutral-700">
              Äiá»u khoáº£n cá»¥ thá»ƒ
              <textarea required name="termsText" defaultValue={terms?.terms_text} className={`${inputClass} min-h-32 resize-y`} placeholder="Quy Ä‘á»‹nh rÃµ vá» quyá»n sá»­ dá»¥ng, pháº¡m vi..." />
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
          {pending ? "Äang xá»­ lÃ½..." : gig ? "Cáº­p nháº­t cÃ´ng viá»‡c" : "Táº¡o cÃ´ng viá»‡c"}
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
