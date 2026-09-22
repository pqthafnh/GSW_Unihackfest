import * as React from "react";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Hash, Key, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TrustProofArtifactProps {
  className?: string;
}

export function TrustProofArtifact({ className }: TrustProofArtifactProps) {
  return (
    <SurfaceCard
      variant="darkSatin"
      elevation="floating"
      className={cn("p-6 sm:p-8 max-w-2xl mx-auto overflow-hidden relative", className)}
    >
      {/* Top ambient highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#2997ff]/40 to-transparent" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2997ff]/10 border border-[#2997ff]/30 flex items-center justify-center text-[#2997ff]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white tracking-tight">
                Receipt Preview
              </div>
              <div className="text-xs text-neutral-400">
                Not minted • Simulated metadata only
              </div>
            </div>
          </div>
          <Badge tone="neutral">Not connected</Badge>
        </div>

        {/* Content rows */}
        <div className="space-y-3.5 text-xs font-mono">
          <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3 space-y-1">
            <div className="text-neutral-400 flex items-center gap-1.5 font-sans text-[11px]">
              <Key className="w-3 h-3 text-[#2997ff]" />
              <span>Planned Escrow Reference</span>
            </div>
            <div className="text-neutral-200 break-all select-all font-mono text-[11px]">
              Not connected — no escrow address exists in this preview
            </div>
          </div>

          <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3 space-y-1">
            <div className="text-neutral-400 flex items-center gap-1.5 font-sans text-[11px]">
              <Hash className="w-3 h-3 text-[#2997ff]" />
              <span>Deliverable Content Hash (SHA-256)</span>
            </div>
            <div className="text-neutral-200 break-all select-all font-mono text-[11px]">
              Simulated content hash metadata only
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
            <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3 space-y-1">
              <div className="text-neutral-400 text-[11px]">License Scope</div>
              <div className="text-sm font-semibold text-white">COMMERCIAL_GAMING</div>
              <div className="text-[11px] text-neutral-400">Irrevocable post-settlement</div>
            </div>

            <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3 space-y-1">
              <div className="text-neutral-400 text-[11px]">Advisory AI Review</div>
              <div className="text-sm font-semibold text-neutral-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                <span>Not connected</span>
              </div>
              <div className="text-[11px] text-neutral-400">Human review remains required</div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="pt-2 border-t border-white/10 text-[11px] text-neutral-400 leading-relaxed font-sans">
          <strong>Mandatory Notice:</strong> This preview is simulated metadata only. A future Verifiable IP License Receipt is technical evidence linked to terms hash, content hash and verified settlement after full integration. No blockchain transaction is submitted.
        </div>
      </div>
    </SurfaceCard>
  );
}
