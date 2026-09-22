import * as React from "react";
import { PLANNED_TECHNICAL_STACK } from "@/data/demo-data";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CircleDashed, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PlannedStackProps {
  className?: string;
}

export function PlannedStack({ className }: PlannedStackProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLANNED_TECHNICAL_STACK.map((item) => {
          const isConfigured = item.status === "Configured";

          return (
            <SurfaceCard
              key={item.service}
              variant="ceramic"
              elevation="raised-xs"
              className="p-5 flex flex-col justify-between border-neutral-200/80"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-base text-[#1d1d1f]">
                    {item.service}
                  </span>
                  <Badge
                    tone={isConfigured ? "verified" : "neutral"}
                    icon={
                      isConfigured ? (
                        <CheckCircle2 className="w-3 h-3 text-[#0066cc]" />
                      ) : (
                        <CircleDashed className="w-3 h-3 text-neutral-400" />
                      )
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
                <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Role: {item.role}
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {item.details}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                <span>Architecture target</span>
                <span className="font-mono">
                  {isConfigured ? "devnet-active" : "pending-integration"}
                </span>
              </div>
            </SurfaceCard>
          );
        })}
      </div>

      <div className="rounded-xl bg-neutral-50 border border-neutral-200/80 p-4 flex items-start gap-3 text-xs text-neutral-600">
        <Info className="w-4 h-4 text-[#0066cc] shrink-0 mt-0.5" aria-hidden="true" />
        <p className="leading-relaxed">
          <strong>Architecture Transparency Notice:</strong> Only the Solana Devnet cluster endpoint is active. Escrow programs, private Supabase buckets, Metaplex Core receipt minting, and AI review providers are in progress and marked <em>Not connected</em>. No integration is declared connected without server-side verification.
        </p>
      </div>
    </div>
  );
}
