import Link from "next/link";

import { AppShell } from "@/components/common/app-shell";
import { ClaimGigButton } from "@/components/gigs/gig-actions";
import { Badge } from "@/components/ui/badge";
import { readWorkerGigs } from "@/lib/gigs/service";
import { requireProfileRole } from "@/lib/profile/server";

function formatAtomicBudget(value: string): string {
  try {
    return BigInt(value).toLocaleString("vi-VN");
  } catch {
    return value;
  }
}

export default async function WorkerPage() {
  const context = await requireProfileRole("WORKER");
  const { data: gigs, error } = await readWorkerGigs();

  return (
    <AppShell
      role="Contributor Workspace"
      profile={context.profile}
      email={context.user.email}
    >
      <div className="space-y-8">
        <Badge tone="neutral">Môi trường thử nghiệm</Badge>

        <div>
          <h1 className="text-4xl font-semibold">Tìm công việc</h1>
          <p className="mt-3 text-neutral-600">
            Dữ liệu được lưu thật trong Supabase. Không sử dụng tiền thật,
            chưa có giao dịch blockchain hoặc ký quỹ on-chain.
          </p>
        </div>

        {error ? (
          <p className="text-red-600">
            Không thể tải dữ liệu công việc. Vui lòng thử lại.
          </p>
        ) : gigs && gigs.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {gigs.map((gig) => (
              <article
                key={gig.id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold">{gig.title}</h2>

                <p className="mt-2 text-sm text-neutral-600">
                  {gig.description}
                </p>

                <p className="mt-3 text-sm">
                  Trạng thái: <strong>{gig.status}</strong>
                  {" · "}
                  {formatAtomicBudget(gig.budget_atomic)} đơn vị thử nghiệm
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    className="rounded-full border px-4 py-2 text-sm"
                    href={`/worker/cong-viec/${gig.id}`}
                  >
                    Chi tiết
                  </Link>

                  {gig.status === "OPEN" ? (
                    <ClaimGigButton gigId={gig.id} />
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed bg-white p-8 text-center">
            <h2 className="text-lg font-semibold">
              Chưa có công việc đang mở
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Công việc sẽ xuất hiện tại đây sau khi khách hàng khóa điều khoản
              và mở nhận việc.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
