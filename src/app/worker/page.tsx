import { Activity, CalendarClock } from "lucide-react";
import { AppShell } from "@/components/common/app-shell";
import { DEMO_GIGS, DEMO_WORKER_METRICS, DEMO_PENDING_REVIEW } from "@/data/demo-data";
import { MetricCard } from "@/components/ui/metric-card";
import { GigPreviewCard } from "@/components/ui/gig-preview-card";
import { SectionHeader } from "@/components/ui/section-header";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Badge } from "@/components/ui/badge";

export default function WorkerPage() {
  const assignedGigs = DEMO_GIGS.filter((gig) => gig.workerId);
  return (
    <AppShell role="Contributor Workspace">
      <div className="space-y-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><Badge tone="neutral">Contributor view · simulated</Badge><h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[#1d1d1f]">Contributor Workspace</h1><p className="mt-3 max-w-2xl text-neutral-600">A read-only preview of assigned work, deadlines and review context for a creative contributor.</p></div>
          <a href="#assigned-gigs" className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#0066cc] px-5 text-sm font-semibold text-[#0066cc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc]">View Assigned Gigs</a>
        </div>
        <section aria-label="Contributor summary metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{DEMO_WORKER_METRICS.map((metric) => <MetricCard key={metric.id} {...metric} />)}</section>
        <section id="assigned-gigs" className="scroll-mt-6 space-y-5"><SectionHeader align="left" eyebrow="Current assignments" title="Assigned gigs" description="Static records only. No submission, payment or wallet actions are available in this shell." /><div className="grid gap-4 lg:grid-cols-2">{assignedGigs.map((gig) => <GigPreviewCard key={gig.id} gig={gig} />)}</div></section>
        <section className="grid gap-5 lg:grid-cols-2">
          <SurfaceCard className="p-6 sm:p-7" elevation="raised-sm"><div className="flex items-start gap-3"><CalendarClock className="h-6 w-6 text-[#0066cc]" /><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0066cc]">Upcoming deadline</p><h2 className="mt-2 text-xl font-semibold">Modular Pixel Art Tilemap</h2><p className="mt-2 text-sm leading-6 text-neutral-600">October 20, 2026 · status: In Progress</p><Badge tone="neutral" className="mt-5">Simulated assignment</Badge></div></div></SurfaceCard>
          <SurfaceCard variant="parchment" className="p-6 sm:p-7"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0066cc]">Submission status</p><h2 className="mt-2 text-xl font-semibold">{DEMO_PENDING_REVIEW.gigTitle}</h2><p className="mt-3 text-sm leading-6 text-neutral-600">Submitted and awaiting human studio review. AI Review is not connected; advisory review signals will be available after integration.</p><Badge tone="warning" className="mt-5">Human review required</Badge></SurfaceCard>
        </section>
        <section><SectionHeader align="left" eyebrow="Workspace pulse" title="Activity" description="There is no live activity feed in the demo shell." /><SurfaceCard className="p-8" elevation="flat"><div className="flex items-start gap-4"><Activity className="mt-1 h-5 w-5 text-neutral-400" /><div><h2 className="font-semibold">Simulated activity will appear here</h2><p className="mt-1 text-sm leading-6 text-neutral-600">Demo earnings are test-asset labels only. Payment actions are not implemented.</p></div></div></SurfaceCard></section>
      </div>
    </AppShell>
  );
}
