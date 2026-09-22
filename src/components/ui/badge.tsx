import * as React from "react";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  Coins,
  AlertCircle,
} from "lucide-react";

export type BadgeTone =
  | "default"
  | "primary"
  | "verified"
  | "funded"
  | "submitted"
  | "completed"
  | "warning"
  | "neutral"
  | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  icon?: React.ReactNode;
  showIcon?: boolean;
}

export function Badge({
  className,
  tone = "default",
  icon,
  showIcon = false,
  children,
  ...props
}: BadgeProps) {
  const toneStyles: Record<BadgeTone, string> = {
    default: "bg-neutral-100 text-neutral-800 border-neutral-200",
    primary: "bg-[#0066cc]/10 text-[#0066cc] border-[#0066cc]/30",
    verified: "bg-[#0066cc]/10 text-[#0066cc] border-[#0066cc]/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]",
    funded: "bg-emerald-50 text-emerald-800 border-emerald-200",
    submitted: "bg-amber-50 text-amber-800 border-amber-200",
    completed: "bg-blue-50 text-blue-800 border-blue-200",
    warning: "bg-orange-50 text-orange-800 border-orange-200",
    neutral: "bg-neutral-100 text-neutral-600 border-neutral-200",
    outline: "bg-transparent text-neutral-700 border-neutral-300",
  };

  const defaultIconForTone = (t: BadgeTone) => {
    switch (t) {
      case "verified":
      case "completed":
        return <CheckCircle2 className="w-3 h-3 shrink-0" aria-hidden="true" />;
      case "funded":
        return <Coins className="w-3 h-3 shrink-0" aria-hidden="true" />;
      case "submitted":
        return <Clock className="w-3 h-3 shrink-0" aria-hidden="true" />;
      case "warning":
        return <AlertCircle className="w-3 h-3 shrink-0" aria-hidden="true" />;
      default:
        return null;
    }
  };

  const renderedIcon = icon ?? (showIcon ? defaultIconForTone(tone) : null);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-tight select-none",
        toneStyles[tone],
        className
      )}
      {...props}
    >
      {renderedIcon}
      <span>{children}</span>
    </span>
  );
}
