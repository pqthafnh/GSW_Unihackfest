import { requireProfileRole } from "@/lib/profile/server";
import { readGig } from "@/lib/gigs/service";
import { SubmissionForm } from "@/components/submissions/submission-form";
export default async function SubmitPage({ params }: { params: Promise<{ gigId: string }> }) {
  const { profile } = await requireProfileRole("WORKER"); const gigId = (await params).gigId;
  const { data: gig } = await readGig(gigId, "WORKER");
  if (!gig || gig.status !== "CLAIMED") return <main className="mx-auto max-w-2xl p-6"><p>Chỉ có thể nộp bài cho công việc đã nhận.</p></main>;
  return <main className="mx-auto max-w-2xl space-y-6 p-6"><h1 className="text-2xl font-bold">Nộp bài cho công việc</h1><p className="text-sm">Tài khoản {profile.display_name}; tệp được lưu trong Storage riêng tư. Đây là môi trường thử nghiệm: không có tiền thật, blockchain hay escrow on-chain.</p><SubmissionForm gigId={gigId} /><p className="text-xs text-gray-600">Hash SHA-256 được tính từ byte thật và không ghi lên blockchain.</p></main>;
}
