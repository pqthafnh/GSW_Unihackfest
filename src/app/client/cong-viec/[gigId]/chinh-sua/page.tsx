import { readGig } from "@/lib/gigs/service";
import { GigForm } from "@/components/gigs/gig-form";
export default async function EditGig({ params }: { params: Promise<{ gigId: string }> }) { const { gigId } = await params; const { data: gig } = await readGig(gigId, "CLIENT"); if (!gig || gig.status !== "DRAFT") return <main className="p-12">Bản nháp không khả dụng.</main>; return <main className="mx-auto max-w-3xl px-6 py-12"><h1 className="mb-5 text-3xl font-semibold">Chỉnh sửa công việc</h1><GigForm gig={gig} /></main>; }
