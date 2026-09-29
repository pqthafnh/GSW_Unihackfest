import { CalendarDays, Coins } from "lucide-react";
import type { GigRecord } from "@/contracts";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { SurfaceCard } from "@/components/ui/surface-card";

export function GigPreviewCard({ gig }: { gig: GigRecord }) {
  return (
    <SurfaceCard interactive={true} className="p-6 h-full flex flex-col group hover:border-[#0066cc]/30 transition-colors" elevation="raised-xs">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <StatusIndicator status={gig.status} size="sm" />
      </div>
      <h3 className="font-semibold text-lg text-[#1d1d1f] group-hover:text-[#0066cc] transition-colors">{gig.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600 flex-1">{gig.brief}</p>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] pt-4 text-xs font-medium text-neutral-500">
        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-neutral-50 rounded-md">
          <CalendarDays className="h-3.5 w-3.5 text-neutral-400" />
          Hạn chót: {new Intl.DateTimeFormat("vi-VN", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(gig.deadline))}
        </span>
        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-[#0066cc] rounded-md">
          <Coins className="h-3.5 w-3.5" />
          {gig.budgetAtomic.toLocaleString("vi-VN")} TEST
        </span>
      </div>
    </SurfaceCard>
  );
}
