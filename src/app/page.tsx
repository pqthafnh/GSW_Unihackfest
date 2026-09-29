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
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/fade-in";

const workflow = [
  ["01", "Shape the brief", "Make the creative scope, format, deadline and intended license easy to understand."],
  ["02", "Lock the terms", "Keep the agreement visible before any future funding integration is considered."],
  ["03", "Review private work", "Keep deliverables off the public surface and make human review the final decision."],
  ["04", "Create future evidence", "Planned receipts can link terms, content hashes and verified settlement after integration."],
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#ffffff] overflow-hidden">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-black/[0.05] bg-[linear-gradient(135deg,#ffffff_0%,#f5f5f7_100%)] relative">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
          <div className="container mx-auto grid gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28 relative z-10" style={{ perspective: "1000px" }}>
            <FadeIn className="max-w-2xl space-y-7">
              <Badge tone="primary" icon={<span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#0066cc] animate-pulse" />}>
                Trust-first creative marketplace
              </Badge>
              <h1 className="text-5xl font-semibold leading-[1.04] tracking-[-0.055em] text-[#1d1d1f] sm:text-6xl lg:text-7xl">
                Small creative work deserves a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066cc] to-[#6eb5ff]">clear, credible path.</span>
              </h1>
              <p className="max-w-xl text-lg leading-8 text-neutral-600">
                Micro-Gig Network helps indie game studios and contributors align on briefs, terms and evidence before the product integrations arrive.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button href="/demo" size="lg" className="shadow-lg shadow-[#0066cc]/20 transition-transform hover:scale-105">
                  Explore Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button href="/worker" variant="secondary" size="lg" className="transition-transform hover:scale-105">Find Work</Button>
              </div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                Demo foundation · Solana Devnet · test assets only
              </p>
            </FadeIn>
            <FadeIn delay={0.2} className="flex justify-center">
              <SurfaceCard variant="parchment" elevation="floating" interactive={true} className="relative overflow-hidden p-5 sm:p-7 w-full max-w-md">
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#0066cc]/40 to-transparent" />
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0066cc]">Product preview</p>
                    <h2 className="mt-1 text-xl font-semibold text-[#1d1d1f]">A calmer project handoff</h2>
                  </div>
                  <Badge tone="neutral" className="bg-white/50 backdrop-blur">Simulated</Badge>
                </div>
                <div className="space-y-3">
                  <div className="rounded-xl border border-black/[0.06] bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div><p className="text-xs text-neutral-500">Studio brief</p><p className="mt-1 font-semibold">Japanese Localization Pack</p></div>
                      <Badge tone="submitted" showIcon>Under review</Badge>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-neutral-100 overflow-hidden"><div className="h-2 w-3/4 rounded-full bg-[#0066cc] relative"><div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div></div></div>
                    <p className="mt-2 text-xs text-neutral-500">Terms visible · deliverable private · human review required</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-[#1d1d1f] p-4 text-white shadow-inner"><FileLock2 className="h-5 w-5 text-[#6eb5ff]" /><p className="mt-6 text-xs text-neutral-400">Terms</p><p className="font-semibold">Locked before funding</p></div>
                    <div className="rounded-xl border border-black/[0.06] bg-white p-4 shadow-sm"><Fingerprint className="h-5 w-5 text-[#0066cc]" /><p className="mt-6 text-xs text-neutral-500">Evidence</p><p className="font-semibold text-[#1d1d1f]">Hash-ready record</p></div>
                  </div>
                </div>
              </SurfaceCard>
            </FadeIn>
          </div>
        </section>

        <section className="container mx-auto px-6 py-20 lg:py-28" style={{ perspective: "1000px" }}>
          <FadeIn>
            <SectionHeader eyebrow="Built for the handoff" title="Clarity at every creative checkpoint." description="A shared foundation for the moments that usually get lost between a brief, a file and a final decision." />
          </FadeIn>
          <StaggerChildren className="grid gap-5 md:grid-cols-3">
            {[
              [LockKeyhole, "Terms before money", "A visible agreement gives both sides a stable starting point. Funding is a planned future step, never implied here."],
              [Fingerprint, "Private by default", "Deliverables and personal information belong off the public surface, with evidence represented by hashes."],
              [Users, "Human decisions", "Review signals can assist a studio lead, but people remain responsible for quality, payout and ownership decisions."],
            ].map(([Icon, title, body], i) => {
              const FeatureIcon = Icon as typeof LockKeyhole;
              return (
                <StaggerItem key={title as string}>
                  <SurfaceCard interactive={true} className="p-6 h-full flex flex-col group" elevation="raised-xs">
                    <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <FeatureIcon className="h-6 w-6 text-[#0066cc]" />
                    </div>
                    <h3 className="text-lg font-semibold">{title as string}</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-600 flex-1">{body as string}</p>
                  </SurfaceCard>
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        </section>

        <section className="bg-[#f5f5f7] relative border-y border-black/[0.05]">
          <div className="absolute inset-0 bg-[radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none"></div>
          <div className="container mx-auto px-6 py-20 lg:py-28 relative z-10" style={{ perspective: "1000px" }}>
            <FadeIn>
              <SectionHeader align="left" eyebrow="How it is meant to work" title="Planned End-to-End Workflow" description="The product direction is clear, while every unconnected integration stays explicitly marked as planned." />
            </FadeIn>
            <StaggerChildren className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {workflow.map(([number, title, body]) => (
                <StaggerItem key={number}>
                  <SurfaceCard variant="ceramic" elevation="flat" interactive={true} className="p-5 h-full group hover:border-[#0066cc]/30 transition-colors">
                    <span className="font-mono text-3xl font-light text-neutral-200 group-hover:text-[#0066cc]/20 transition-colors absolute top-4 right-4 z-0">{number}</span>
                    <div className="relative z-10">
                      <span className="font-mono text-xs font-bold text-[#0066cc] bg-blue-50 px-2 py-1 rounded">{number}</span>
                      <h3 className="mt-6 font-semibold text-lg">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-neutral-600">{body}</p>
                    </div>
                  </SurfaceCard>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>

        <section className="container mx-auto grid gap-5 px-6 py-20 md:grid-cols-2 lg:py-28" style={{ perspective: "1000px" }}>
          <FadeIn delay={0.1} className="h-full">
            <SurfaceCard variant="darkSatin" interactive={true} className="p-7 sm:p-9 h-full flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl group-hover:bg-blue-500/20 transition-colors duration-500 pointer-events-none"></div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6eb5ff]">For studios</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">Commission the work, not the ambiguity.</h2>
                <p className="mt-4 leading-7 text-neutral-300 max-w-md">Keep creative scope, intended usage and review responsibility visible from the first brief.</p>
              </div>
              <Link href="/client" className="mt-12 inline-flex min-h-[44px] items-center font-semibold text-[#6eb5ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6eb5ff] group/link">
                Open client demo <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </SurfaceCard>
          </FadeIn>
          <FadeIn delay={0.2} className="h-full">
            <SurfaceCard variant="parchment" interactive={true} className="p-7 sm:p-9 h-full flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-[#0066cc]/5 blur-3xl group-hover:bg-[#0066cc]/10 transition-colors duration-500 pointer-events-none"></div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0066cc]">For contributors</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#1d1d1f]">Know what “done” means.</h2>
                <p className="mt-4 leading-7 text-neutral-600 max-w-md">See the brief, the intended license and the current review status without exposing your deliverables publicly.</p>
              </div>
              <Link href="/worker" className="mt-12 inline-flex min-h-[44px] items-center font-semibold text-[#0066cc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc] group/link">
                Open contributor demo <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </SurfaceCard>
          </FadeIn>
        </section>

        <section className="bg-[#1d1d1f] px-6 py-20 lg:py-28 border-y border-white/5 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-[#0066cc]/10 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="container mx-auto relative z-10">
            <FadeIn>
              <SectionHeader onDark align="left" eyebrow="Trust, without overclaiming" title="Evidence is useful when its limits are visible." description="The receipt direction is a technical artifact, not a legal certificate or automatic copyright ownership." />
            </FadeIn>
            <FadeIn delay={0.2}>
              <TrustProofArtifact />
            </FadeIn>
          </div>
        </section>

        <section className="container mx-auto px-6 py-20 lg:py-28">
          <FadeIn>
            <SectionHeader align="left" eyebrow="Architecture transparency" title="Planned Technical Stack" description="Only the Devnet endpoint is configured in this foundation. Every other service remains not connected." />
          </FadeIn>
          <FadeIn delay={0.2}>
            <PlannedStack />
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/[0.07] p-5 text-sm text-amber-900 shadow-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" /><p><strong>Disclosure:</strong> This is a simulated product shell using test assets. No real funds move and no blockchain transaction is submitted.</p></div>
          </FadeIn>
        </section>
      </main>
      <Footer />
    </div>
  );
}
