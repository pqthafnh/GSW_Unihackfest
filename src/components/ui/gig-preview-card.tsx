import { CalendarDays } from "lucide-react";
import type { GigRecord } from "@/contracts";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { SurfaceCard } from "@/components/ui/surface-card";

export function GigPreviewCard({ gig }: { gig: GigRecord }) {
  return <SurfaceCard className="p-5" elevation="raised-xs"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-semibold text-[#1d1d1f]">{gig.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">{gig.brief}</p></div><StatusIndicator status={gig.status} size="sm" /></div><div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-black/[0.06] pt-4 text-xs text-neutral-500"><span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />Due {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(gig.deadline))}</span><span>{gig.budgetAtomic.toLocaleString("en-US")} atomic test units</span></div></SurfaceCard>;
}
