import { GigForm } from "@/components/gigs/gig-form";
import { requireProfileRole } from "@/lib/profile/server";
export default async function CreateGigPage() { await requireProfileRole("CLIENT"); return <main className="mx-auto max-w-3xl space-y-5 px-6 py-12"><h1 className="text-3xl font-semibold">Tạo công việc</h1><p className="text-sm text-neutral-600">Môi trường thử nghiệm · dữ liệu lưu thật trong Supabase · không tiền thật, blockchain hay ký quỹ on-chain.</p><GigForm /></main>; }
