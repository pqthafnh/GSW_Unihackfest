import Link from "next/link";
import { requireProfileRole } from "@/lib/profile/server";
import { readClientGigs } from "@/lib/gigs/service";
import { AppShell } from "@/components/common/app-shell";

export default async function ClientGigsPage() {
  const context = await requireProfileRole("CLIENT");
  const { data: gigs, error } = await readClientGigs();
  return (
    <AppShell role="Client Studio" profile={context.profile} email={context.user.email}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-sm font-semibold text-[#0066cc]">Công việc</p><h1 className="mt-2 text-4xl font-semibold">Công việc của bạn</h1></div>
          <Link href="/client/cong-viec/tao-moi" className="inline-flex min-h-[44px] items-center rounded-full bg-[#0066cc] px-5 font-semibold text-white">Tạo công việc</Link>
        </div>
        {error ? <p role="alert" className="text-red-700">Không thể tải dữ liệu công việc.</p> : gigs?.length ? <div className="grid gap-4 lg:grid-cols-2">{gigs.map((gig) => <Link key={gig.id} href={`/client/cong-viec/${gig.id}`} className="rounded-2xl bg-white p-6 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc]"><h2 className="text-xl font-semibold">{gig.title}</h2><p className="mt-2 line-clamp-2 text-sm text-neutral-600">{gig.description}</p><p className="mt-4 text-sm">Trạng thái: <strong>{gig.status}</strong></p></Link>)}</div> : <p className="rounded-2xl bg-white p-8 text-neutral-600">Chưa có công việc. Hãy tạo bản nháp đầu tiên.</p>}
      </div>
    </AppShell>
  );
}
