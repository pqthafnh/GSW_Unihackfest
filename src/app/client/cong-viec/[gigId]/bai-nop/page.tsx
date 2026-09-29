import { requireProfileRole } from "@/lib/profile/server";
import { listGigSubmissions } from "@/lib/submissions/service";
export default async function ReviewPage({ params }: { params: Promise<{ gigId: string }> }) {
  await requireProfileRole("CLIENT"); const gigId = (await params).gigId;
  const submissions = await listGigSubmissions(gigId);
  return <main className="mx-auto max-w-3xl space-y-6 p-6"><h1 className="text-2xl font-bold">Bài nộp</h1>{submissions?.map((s) => <article key={s.id} className="rounded border p-4"><h2 className="font-semibold">{s.submission_title} · phiên bản {s.version}</h2><p>{s.summary}</p><p className="text-sm">Tệp riêng tư: {s.original_file_name} · trạng thái {s.status}</p><a className="text-blue-600 underline" href={`/api/submissions/${s.id}/signed-url`}>Tải tệp</a>{s.status === "SUBMITTED" && <form action={`/api/submissions/${s.id}/revision`} method="post"><button className="mt-2 rounded border px-3 py-1">Yêu cầu chỉnh sửa</button></form>}</article>)}</main>;
}
