import { Badge } from "@/components/ui/badge";
import { SurfaceCard } from "@/components/ui/surface-card";

export interface MetricCardProps {
  label: string;
  value: string;
  description: string;
  badgeText?: string;
}

export function MetricCard({ label, value, description, badgeText }: MetricCardProps) {
  return <SurfaceCard className="p-5" elevation="raised-xs"><div className="flex items-start justify-between gap-3"><p className="text-sm font-medium text-neutral-500">{label}</p>{badgeText && <Badge tone="neutral">{badgeText}</Badge>}</div><p className="mt-5 text-2xl font-semibold tracking-tight text-[#1d1d1f]">{value}</p><p className="mt-2 text-xs leading-5 text-neutral-500">{description}</p></SurfaceCard>;
}
