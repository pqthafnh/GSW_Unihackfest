import Link from "next/link";
import { ArrowLeft, LayoutDashboard, Search } from "lucide-react";
import { DemoModeBanner } from "@/components/common/demo-mode-banner";
import { logoutAction } from "@/app/actions/auth";
import type { Profile } from "@/lib/profile/types";

export interface AppShellProps {
  role: "Client Studio" | "Contributor Workspace";
  profile: Profile;
  email?: string;
  children: React.ReactNode;
}

export function AppShell({ role, profile, email, children }: AppShellProps) {
  const isClient = role === "Client Studio";
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f7]">
      <header className="border-b border-black/[0.06] bg-white">
        <div className="container mx-auto flex min-h-16 items-center justify-between gap-4 px-6">
          <Link href="/" className="flex min-h-[44px] items-center gap-2 rounded-lg font-semibold tracking-tight text-[#1d1d1f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc]">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0066cc] text-sm font-bold text-white">MG</span>
            <span className="hidden sm:inline">Micro-Gig Network</span>
          </Link>
          <nav aria-label="Application navigation" className="flex items-center gap-1">
            <Link href={isClient ? "/client" : "/worker"} className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#0066cc]/10 px-4 text-sm font-semibold text-[#0066cc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc]"><LayoutDashboard className="h-4 w-4" />Overview</Link>
            <Link href="/demo" className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 text-sm font-medium text-neutral-600 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc]"><Search className="h-4 w-4" />Switch demo</Link>
          </nav>
          <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-sm font-semibold text-[#1d1d1f]">{profile.display_name}</p><p className="text-xs text-neutral-500">{profile.role === "CLIENT" ? "Nhà tuyển dụng" : "Cộng tác viên"}{email ? ` · ${email}` : ""}</p></div><form action={logoutAction}><button type="submit" className="min-h-[44px] rounded-full border border-black/10 px-3 text-xs font-semibold text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc]">Đăng xuất</button></form></div>
        </div>
      </header>
      <main className="flex-1"><div className="container mx-auto max-w-7xl px-6 py-8 lg:py-12"><div className="mb-8"><Link href="/demo" className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc]"><ArrowLeft className="h-4 w-4" />Back to demo choices</Link></div><DemoModeBanner className="mb-8" />{children}</div></main>
      <footer className="border-t border-black/[0.06] bg-white px-6 py-6 text-center text-xs text-neutral-500">Demo workspace · test assets only · no blockchain transaction submitted</footer>
    </div>
  );
}
