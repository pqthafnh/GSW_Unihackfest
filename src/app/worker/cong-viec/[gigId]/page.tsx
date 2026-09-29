import Link from "next/link";

import { requireProfileRole } from "@/lib/profile/server";
import { ClaimGigButton } from "@/components/gigs/gig-actions";
import { readGig } from "@/lib/gigs/service";

export default async function WorkerGig({
  params,
}: {
  params: Promise<{ gigId: string }>;
}) {
  await requireProfileRole("WORKER");
  const { gigId } = await params;
  const { data: gig } = await readGig(gigId, "WORKER");

  if (!gig) {
    return (
      <main className="mx-auto max-w-3xl space-y-4 px-6 py-12">
        <p>Không tìm thấy công việc.</p>

        <Link
          href="/worker"
          className="inline-flex min-h-11 items-center rounded-full border border-slate-300 px-4 font-medium text-slate-700 hover:bg-slate-50"
        >
          ← Quay lại danh sách công việc
        </Link>
      </main>
    );
  }

  const licenseTerms = Array.isArray(gig.license_terms)
    ? gig.license_terms[0]?.terms_text
    : gig.license_terms?.terms_text;

  return (
    <main className="mx-auto max-w-3xl space-y-5 px-6 py-12">
      <Link
        href="/worker"
        className="inline-flex min-h-11 items-center rounded-full border border-slate-300 px-4 font-medium text-slate-700 hover:bg-slate-50"
      >
        ← Quay lại danh sách công việc
      </Link>

      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold">{gig.title}</h1>

        <p className="whitespace-pre-wrap text-slate-700">
          {gig.description}
        </p>

        <p>
          Trạng thái: <strong>{gig.status}</strong>
        </p>

        <div className="flex flex-wrap gap-3">
          {gig.status === "OPEN" && (
            <ClaimGigButton gigId={gig.id} />
          )}

          {gig.status === "CLAIMED" && (
            <Link
              href={`/worker/cong-viec/${gigId}/nop-bai`}
              className="inline-flex min-h-11 items-center rounded-full bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700"
            >
              Nộp bài
            </Link>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Điều khoản công việc</h2>

        <p className="whitespace-pre-wrap text-slate-700">
          {licenseTerms ?? "Chưa có điều khoản công việc."}
        </p>
      </section>
    </main>
  );
}
