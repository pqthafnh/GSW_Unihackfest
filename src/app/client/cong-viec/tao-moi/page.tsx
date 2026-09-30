import { GigForm } from "@/components/gigs/gig-form";
import { requireProfileRole } from "@/lib/profile/server";

export default async function CreateGigPage() {
  await requireProfileRole("CLIENT");
  return (
    <main className="mx-auto max-w-3xl space-y-5 px-6 py-12">
      <h1 className="text-3xl font-semibold">Tạo công việc mới</h1>
      <p className="text-sm text-neutral-600">
        Quy trình Hybrid: Khởi tạo điều khoản và nội dung công việc (Web2 trên Supabase) trước khi tiến hành Khóa điều khoản và Nạp quỹ ký quỹ On-chain (Web3 trên Solana Devnet).
      </p>
      <GigForm />
    </main>
  );
}
