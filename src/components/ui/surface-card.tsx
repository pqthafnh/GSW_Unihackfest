import * as React from "react";
import { cn } from "@/lib/utils";

export interface SurfaceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "ceramic" | "parchment" | "darkSatin" | "trustProof";
  elevation?: "flat" | "raised-xs" | "raised-sm" | "floating";
}

export function SurfaceCard({
  className,
  variant = "ceramic",
  elevation = "raised-xs",
  children,
  ...props
}: SurfaceCardProps) {
  const variantStyles: Record<NonNullable<SurfaceCardProps["variant"]>, string> = {
    ceramic:
      "bg-white text-[#1d1d1f] border border-black/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]",
    parchment:
      "bg-[#f5f5f7] text-[#1d1d1f] border border-black/[0.04]",
    darkSatin:
      "bg-[#272729] text-white border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_40px_rgba(0,0,0,0.32)]",
    trustProof:
      "bg-[#1e1e20] text-white border border-white/[0.12] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_12px_32px_rgba(0,0,0,0.35)]",
  };

  const elevationStyles: Record<NonNullable<SurfaceCardProps["elevation"]>, string> = {
    flat: "shadow-none",
    "raised-xs": "shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.03)]",
    "raised-sm": "shadow-[0_2px_6px_rgba(0,0,0,0.06),0_14px_28px_rgba(0,0,0,0.05)]",
    floating: "shadow-[0_4px_12px_rgba(0,0,0,0.08),0_24px_48px_rgba(0,0,0,0.08)]",
  };

  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-200",
        variantStyles[variant],
        elevation !== "flat" && elevationStyles[elevation],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
