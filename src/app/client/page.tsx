import { Activity, LockKeyhole } from "lucide-react";
import { AppShell } from "@/components/common/app-shell";
import { DEMO_CLIENT_METRICS, DEMO_GIGS, DEMO_PENDING_REVIEW } from "@/data/demo-data";
import { MetricCard } from "@/components/ui/metric-card";
import { GigPreviewCard } from "@/components/ui/gig-preview-card";
import { SectionHeader } from "@/components/ui/section-header";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Badge } from "@/components/ui/badge";

export default function ClientPage() {
  return (
    <AppShell role="Client Studio">
      <div className="space-y-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><Badge tone="neutral">Client view · simulated</Badge><h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[#1d1d1f]">Client Studio</h1><p className="mt-3 max-w-2xl text-neutral-600">A read-only preview of how a studio can keep creative work, terms and review context together.</p></div>
          <a href="#recent-gigs" className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#0066cc] px-5 text-sm font-semibold text-[#0066cc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc]">View Demo Gigs</a>
        </div>
        <section aria-label="Client summary metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{DEMO_CLIENT_METRICS.map((metric) => <MetricCard key={metric.id} {...metric} />)}</section>
        <section id="recent-gigs" className="scroll-mt-6 space-y-5"><SectionHeader align="left" eyebrow="Portfolio view" title="Recent gigs" description="Static records only. Funding and settlement controls are intentionally not available in this shell." /><div className="grid gap-4 lg:grid-cols-2">{DEMO_GIGS.map((gig) => <GigPreviewCard key={gig.id} gig={gig} />)}</div></section>
        <section className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          <SurfaceCard className="p-6 sm:p-7" elevation="raised-sm"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0066cc]">Submission requiring review</p><h2 className="mt-2 text-xl font-semibold">{DEMO_PENDING_REVIEW.gigTitle}</h2><p className="mt-2 text-sm text-neutral-600">Submitted by {DEMO_PENDING_REVIEW.contributorName} · {DEMO_PENDING_REVIEW.fileName}</p></div><Badge tone="warning">Human review required</Badge></div><div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-[#f5f5f7] p-4"><p className="text-xs text-neutral-500">Content hash</p><p className="mt-2 break-all font-mono text-xs text-neutral-700">{DEMO_PENDING_REVIEW.contentHashSha256}</p></div><div className="rounded-xl bg-[#f5f5f7] p-4"><p className="text-xs text-neutral-500">AI Review</p><p className="mt-2 font-semibold text-[#1d1d1f]">Not connected</p><p className="mt-1 text-xs leading-5 text-neutral-600">Advisory review signals will be available after integration. Human review remains required.</p></div></div></SurfaceCard>
          <SurfaceCard variant="parchment" className="p-6 sm:p-7"><LockKeyhole className="h-6 w-6 text-[#0066cc]" /><h2 className="mt-5 text-xl font-semibold">Planned escrow status</h2><p className="mt-3 text-sm leading-6 text-neutral-600">Terms and escrow verification are planned. Anchor Escrow is not connected, so this view has no funding action.</p><Badge tone="neutral" className="mt-6">Not connected</Badge></SurfaceCard>
        </section>
        <section><SectionHeader align="left" eyebrow="Workspace pulse" title="Recent activity" description="There is no live activity feed in the demo shell." /><SurfaceCard className="p-8" elevation="flat"><div className="flex items-start gap-4"><Activity className="mt-1 h-5 w-5 text-neutral-400" /><div><h2 className="font-semibold">Simulated activity will appear here</h2><p className="mt-1 text-sm leading-6 text-neutral-600">This area is intentionally informational until authenticated activity and server-side events are connected.</p></div></div></SurfaceCard></section>
      </div>
    </AppShell>
  );
}
