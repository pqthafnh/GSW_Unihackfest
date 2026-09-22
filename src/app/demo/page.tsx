import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Palette } from "lucide-react";
import { Footer } from "@/components/common/footer";
import { Navbar } from "@/components/common/navbar";
import { DemoModeBanner } from "@/components/common/demo-mode-banner";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { SurfaceCard } from "@/components/ui/surface-card";

export default function DemoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#ffffff]">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto max-w-5xl px-6 py-16 lg:py-24">
          <DemoModeBanner className="mb-10" />
          <SectionHeader align="left" eyebrow="Explore the shell" title="Choose a perspective." description="Both paths use the same simulated records to show how a trust-first creative marketplace can feel before the underlying integrations are connected." />
          <div className="grid gap-5 md:grid-cols-2">
            <SurfaceCard className="flex flex-col p-7 sm:p-9" elevation="raised-sm">
              <BriefcaseBusiness className="h-7 w-7 text-[#0066cc]" />
              <h2 className="mt-8 text-2xl font-semibold">Continue as Client</h2>
              <p className="mt-3 flex-1 leading-7 text-neutral-600">Review briefs, simulated gig status and a submission awaiting human studio review.</p>
              <Button href="/client" className="mt-8 w-full">Open Client Studio <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </SurfaceCard>
            <SurfaceCard variant="parchment" className="flex flex-col p-7 sm:p-9" elevation="raised-sm">
              <Palette className="h-7 w-7 text-[#0066cc]" />
              <h2 className="mt-8 text-2xl font-semibold">Continue as Contributor</h2>
              <p className="mt-3 flex-1 leading-7 text-neutral-600">See assigned creative work, upcoming deadlines and clearly labeled simulated earnings.</p>
              <Button href="/worker" className="mt-8 w-full">Open Contributor Workspace <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </SurfaceCard>
          </div>
          <p className="mt-10 text-center text-sm text-neutral-500"><Link href="/" className="font-semibold text-[#0066cc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc]">Return to overview</Link></p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
