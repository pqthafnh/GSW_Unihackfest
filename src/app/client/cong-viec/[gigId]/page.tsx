import Link from "next/link";
import { readGig } from "@/lib/gigs/service";
import { GigAction } from "@/components/gigs/gig-actions";
import { FundGigButton, ApproveReleaseButton } from "@/components/gigs/blockchain-actions";
import { DevnetWallet } from "@/components/solana/devnet-wallet";

export default async function GigDetail({ params }: { params: Promise<{ gigId: string }> }) {
  const { gigId } = await params;
  const { data: gig } = await readGig(gigId, "CLIENT");
  if (!gig) return <main className="p-12">Không tìm thấy công việc.</main>;

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-6 py-12">
      <div className="flex items-center justify-between">
        <Link href="/client" className="text-sm font-medium text-[#0066cc] hover:underline">
          ← Quay lại danh sách
        </Link>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
          Trạng thái: {gig.status}
        </span>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-3">
        <h1 className="text-3xl font-bold text-[#1d1d1f]">{gig.title}</h1>
        <p className="text-neutral-600">{gig.description}</p>
        <div className="flex flex-wrap gap-4 pt-2 text-sm text-neutral-500">
          <span>Ngân sách: <strong className="text-neutral-900 font-semibold">{gig.budget_atomic} SOL</strong></span>
          <span>Số lần sửa đổi: <strong className="text-neutral-900 font-semibold">{gig.revision_allowance}</strong></span>
          <span>Danh mục: <strong className="text-neutral-900 font-semibold">{gig.category}</strong></span>
        </div>
      </div>

      {/* Solana Devnet Wallet Connection Bar */}
      <DevnetWallet />

      <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Điều khoản & Bản quyền</h2>
        <p className="whitespace-pre-wrap rounded-xl bg-neutral-50 p-4 text-sm text-neutral-700 font-mono">
          {Array.isArray(gig.license_terms) ? gig.license_terms[0]?.terms_text : gig.license_terms?.terms_text}
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-[#1d1d1f]">Thao tác hợp đồng (Web2 + Web3)</h2>

        {gig.status === "DRAFT" && (
          <div className="flex flex-wrap items-center gap-3">
            <GigAction gigId={gig.id} operation="lock_gig_terms" label="1. Khóa điều khoản (Terms Lock)" />
            <Link
              href={`/client/cong-viec/${gig.id}/chinh-sua`}
              className="rounded-full border border-neutral-300 px-5 py-2 text-sm font-medium hover:bg-neutral-50"
            >
              Chỉnh sửa thông tin
            </Link>
          </div>
        )}

        {/* Khi đã khóa Terms: Yêu cầu nạp tiền ký quỹ On-Chain bằng ví */}
        {gig.status === "TERMS_LOCKED" && (
          <div className="space-y-3">
            <div className="rounded-xl bg-blue-50/70 p-4 border border-blue-100 text-sm text-blue-900">
              <p className="font-semibold mb-1">Bước nạp quỹ On-chain (Escrow Funding):</p>
              <p>Hợp đồng yêu cầu nạp tiền vào quỹ bảo chứng. Khi bấm nút dưới, ví Solana (Phantom / Solflare) sẽ mở popup yêu cầu ký giao dịch và trừ SOL từ ví của bạn trên mạng Devnet.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <FundGigButton gigId={gig.id} amount={BigInt(gig.budget_atomic)} />
              <GigAction gigId={gig.id} operation="open_gig" label="Bỏ qua nạp (Mở trực tiếp)" />
            </div>
          </div>
        )}

        {/* Khi đã OPEN: Đang chờ worker nhận việc */}
        {gig.status === "OPEN" && (
          <div className="rounded-xl bg-green-50 p-4 border border-green-200 text-sm text-green-900">
            <p className="font-semibold">✓ Công việc đã được nạp quỹ và Mở công khai (OPEN)</p>
            <p className="mt-1">Đang chờ Worker ứng tuyển hoặc nhận việc trên sàn việc làm.</p>
          </div>
        )}

        {/* Khi đã CLAIMED: Cho phép nghiệm thu & giải ngân bằng ví On-chain */}
        {gig.status === "CLAIMED" && (
          <div className="space-y-3">
            <div className="rounded-xl bg-amber-50 p-4 border border-amber-200 text-sm text-amber-900">
              <p className="font-semibold mb-1">Nghiệm thu & Giải ngân (Settlement):</p>
              <p>Worker đã nhận việc và nộp sản phẩm. Hãy kiểm tra bài nộp. Khi bạn đồng ý nghiệm thu, ví Solana sẽ mở popup để bạn ký xác nhận giải ngân On-chain cho Worker.</p>
            </div>
            <ApproveReleaseButton gigId={gig.id} workerAddress={gig.assigned_worker_id || undefined} />
          </div>
        )}

        {gig.status === "CANCELLED" && (
          <div className="rounded-xl bg-neutral-100 p-4 text-sm text-neutral-600">
            Công việc này đã hoàn tất hoặc đã hủy bỏ.
          </div>
        )}
      </div>
    </main>
  );
}
