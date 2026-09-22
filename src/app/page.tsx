import Link from "next/link";
import { ArrowRight, Check, FileLock2, Fingerprint, LockKeyhole, Users } from "lucide-react";
import { Footer } from "@/components/common/footer";
import { Navbar } from "@/components/common/navbar";
import { PlannedStack } from "@/components/common/planned-stack";
import { TrustProofArtifact } from "@/components/common/trust-proof-artifact";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { SurfaceCard } from "@/components/ui/surface-card";

const workflow = [
  ["01", "Shape the brief", "Make the creative scope, format, deadline and intended license easy to understand."],
  ["02", "Lock the terms", "Keep the agreement visible before any future funding integration is considered."],
  ["03", "Review private work", "Keep deliverables off the public surface and make human review the final decision."],
  ["04", "Create future evidence", "Planned receipts can link terms, content hashes and verified settlement after integration."],
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#ffffff]">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-black/[0.05] bg-[linear-gradient(135deg,#ffffff_0%,#f5f5f7_100%)]">
          <div className="container mx-auto grid gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
            <div className="max-w-2xl space-y-7">
              <Badge tone="primary" icon={<span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#0066cc]" />}>
                Trust-first creative marketplace
              </Badge>
              <h1 className="text-5xl font-semibold leading-[1.04] tracking-[-0.055em] text-[#1d1d1f] sm:text-6xl lg:text-7xl">
                Small creative work deserves a clear, credible path.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-neutral-600">
                Micro-Gig Network helps indie game studios and contributors align on briefs, terms and evidence before the product integrations arrive.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button href="/demo" size="lg">Explore Demo <ArrowRight className="ml-2 h-4 w-4" /></Button>
                <Button href="/worker" variant="secondary" size="lg">Find Work</Button>
              </div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                Demo foundation · Solana Devnet · test assets only
              </p>
            </div>
            <SurfaceCard variant="parchment" elevation="floating" className="relative overflow-hidden p-5 sm:p-7">
              <div className="absolute inset-x-8 top-0 h-px bg-[#0066cc]/40" />
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0066cc]">Product preview</p>
                  <h2 className="mt-1 text-xl font-semibold text-[#1d1d1f]">A calmer project handoff</h2>
                </div>
                <Badge tone="neutral">Simulated</Badge>
              </div>
              <div className="space-y-3">
                <div className="rounded-xl border border-black/[0.06] bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div><p className="text-xs text-neutral-500">Studio brief</p><p className="mt-1 font-semibold">Japanese Localization Pack</p></div>
                    <Badge tone="submitted" showIcon>Under review</Badge>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-neutral-100"><div className="h-2 w-3/4 rounded-full bg-[#0066cc]" /></div>
                  <p className="mt-2 text-xs text-neutral-500">Terms visible · deliverable private · human review required</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#1d1d1f] p-4 text-white"><FileLock2 className="h-5 w-5 text-[#6eb5ff]" /><p className="mt-6 text-xs text-neutral-400">Terms</p><p className="font-semibold">Locked before funding</p></div>
                  <div className="rounded-xl border border-black/[0.06] bg-white p-4"><Fingerprint className="h-5 w-5 text-[#0066cc]" /><p className="mt-6 text-xs text-neutral-500">Evidence</p><p className="font-semibold text-[#1d1d1f]">Hash-ready record</p></div>
                </div>
              </div>
            </SurfaceCard>
          </div>
        </section>

        <section className="container mx-auto px-6 py-20 lg:py-28">
          <SectionHeader eyebrow="Built for the handoff" title="Clarity at every creative checkpoint." description="A shared foundation for the moments that usually get lost between a brief, a file and a final decision." />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              [LockKeyhole, "Terms before money", "A visible agreement gives both sides a stable starting point. Funding is a planned future step, never implied here."],
              [Fingerprint, "Private by default", "Deliverables and personal information belong off the public surface, with evidence represented by hashes."],
              [Users, "Human decisions", "Review signals can assist a studio lead, but people remain responsible for quality, payout and ownership decisions."],
            ].map(([Icon, title, body]) => {
              const FeatureIcon = Icon as typeof LockKeyhole;
              return <SurfaceCard key={title as string} className="p-6" elevation="raised-xs"><FeatureIcon className="h-6 w-6 text-[#0066cc]" /><h3 className="mt-8 text-lg font-semibold">{title as string}</h3><p className="mt-2 text-sm leading-6 text-neutral-600">{body as string}</p></SurfaceCard>;
            })}
          </div>
        </section>

        <section className="bg-[#f5f5f7]">
          <div className="container mx-auto px-6 py-20 lg:py-28">
            <SectionHeader align="left" eyebrow="How it is meant to work" title="Planned End-to-End Workflow" description="The product direction is clear, while every unconnected integration stays explicitly marked as planned." />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {workflow.map(([number, title, body]) => <SurfaceCard key={number} variant="ceramic" elevation="flat" className="p-5"><span className="font-mono text-xs text-[#0066cc]">{number}</span><h3 className="mt-8 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-neutral-600">{body}</p></SurfaceCard>)}
            </div>
          </div>
        </section>

        <section className="container mx-auto grid gap-5 px-6 py-20 md:grid-cols-2 lg:py-28">
          <SurfaceCard variant="darkSatin" className="p-7 sm:p-9"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6eb5ff]">For studios</p><h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">Commission the work, not the ambiguity.</h2><p className="mt-4 leading-7 text-neutral-300">Keep creative scope, intended usage and review responsibility visible from the first brief.</p><Link href="/client" className="mt-8 inline-flex min-h-[44px] items-center font-semibold text-[#6eb5ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6eb5ff]">Open client demo <ArrowRight className="ml-2 h-4 w-4" /></Link></SurfaceCard>
          <SurfaceCard variant="parchment" className="p-7 sm:p-9"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0066cc]">For contributors</p><h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#1d1d1f]">Know what “done” means.</h2><p className="mt-4 leading-7 text-neutral-600">See the brief, the intended license and the current review status without exposing your deliverables publicly.</p><Link href="/worker" className="mt-8 inline-flex min-h-[44px] items-center font-semibold text-[#0066cc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc]">Open contributor demo <ArrowRight className="ml-2 h-4 w-4" /></Link></SurfaceCard>
        </section>

        <section className="bg-[#1d1d1f] px-6 py-20 lg:py-28">
          <div className="container mx-auto">
            <SectionHeader onDark align="left" eyebrow="Trust, without overclaiming" title="Evidence is useful when its limits are visible." description="The receipt direction is a technical artifact, not a legal certificate or automatic copyright ownership." />
            <TrustProofArtifact />
          </div>
        </section>

        <section className="container mx-auto px-6 py-20 lg:py-28">
          <SectionHeader align="left" eyebrow="Architecture transparency" title="Planned Technical Stack" description="Only the Devnet endpoint is configured in this foundation. Every other service remains not connected." />
          <PlannedStack />
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/[0.07] p-5 text-sm text-amber-900"><Check className="mt-0.5 h-4 w-4 shrink-0" /><p><strong>Disclosure:</strong> This is a simulated product shell using test assets. No real funds move and no blockchain transaction is submitted.</p></div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
