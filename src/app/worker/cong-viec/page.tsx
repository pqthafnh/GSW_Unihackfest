import Link from "next/link";
import { requireProfileRole } from "@/lib/profile/server";
import { readWorkerGigs } from "@/lib/gigs/service";
import { AppShell } from "@/components/common/app-shell";

export default async function WorkerGigsPage() {
  const context = await requireProfileRole("WORKER");
  const { data: gigs, error } = await readWorkerGigs();
  return (
    <AppShell role="Contributor Workspace" profile={context.profile} email={context.user.email}>
      <div className="space-y-6">
        <p className="text-sm font-semibold text-[#0066cc]">Công việc khả dụng</p><h1 className="text-4xl font-semibold">Tìm công việc</h1>
        {error ? <p role="alert" className="text-red-700">Không thể tải dữ liệu công việc.</p> : gigs?.length ? <div className="grid gap-4 lg:grid-cols-2">{gigs.map((gig) => <Link key={gig.id} href={`/worker/cong-viec/${gig.id}`} className="rounded-2xl bg-white p-6 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc]"><h2 className="text-xl font-semibold">{gig.title}</h2><p className="mt-2 line-clamp-2 text-sm text-neutral-600">{gig.description}</p><p className="mt-4 text-sm">Trạng thái: <strong>{gig.status}</strong></p></Link>)}</div> : <p className="rounded-2xl bg-white p-8 text-neutral-600">Hiện chưa có công việc OPEN.</p>}
      </div>
    </AppShell>
  );
}
