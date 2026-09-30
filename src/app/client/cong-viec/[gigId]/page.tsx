import Link from "next/link";
import { readGig } from "@/lib/gigs/service";
import { GigAction } from "@/components/gigs/gig-actions";
import { FundGigButton, ApproveReleaseButton } from "@/components/gigs/blockchain-actions";

export default async function GigDetail({ params }: { params: Promise<{ gigId: string }> }) {
  const { gigId } = await params;
  const { data: gig } = await readGig(gigId, "CLIENT");
  if (!gig) return <main className="p-12">Không tìm thấy công việc.</main>;

  // Giả lập hash và address cho UI test (do backend database chưa sync đủ schema)
  const fakeDigest = "11111111111111111111111111111111111111111111"; // 32 bytes hash base58 string mock
  const fakeWorker = "11111111111111111111111111111111111111111111"; // Mock solana address, do NOT use UUID from DB as it crashes base58 parser

  return (
    <main className="mx-auto max-w-3xl space-y-5 px-6 py-12">
      <Link href="/client">← Danh sách</Link>
      <h1 className="text-3xl font-semibold">{gig.title}</h1>
      <p>{gig.description}</p>
      <p>Trạng thái: <strong>{gig.status}</strong></p>
      <p className="whitespace-pre-wrap rounded-xl bg-white p-5">
        {Array.isArray(gig.license_terms) ? gig.license_terms[0]?.terms_text : gig.license_terms?.terms_text}
      </p>
      <div className="flex gap-2">
        {/* Nếu đã khóa term thì gọi Nạp tiền */}
        {gig.status === "TERMS_LOCKED" && (
          <>
            <FundGigButton gigId={gig.id} gigDigestHash={fakeDigest} amount={BigInt(gig.budget_atomic)} />
            <GigAction gigId={gig.id} operation="open_gig" label="Mở nhận việc (Bỏ qua nạp)" />
          </>
        )}
        
        {/* Nút giả định cho việc Approve khi đã CLAIMED */}
        {gig.status === "CLAIMED" && (
          <ApproveReleaseButton gigId={gig.id} gigDigestHash={fakeDigest} workerAddress={fakeWorker} />
        )}
      </div>
    </main>
  );
}
