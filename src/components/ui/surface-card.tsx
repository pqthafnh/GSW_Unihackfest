"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface SurfaceCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"> {
  variant?: "ceramic" | "parchment" | "darkSatin" | "trustProof";
  elevation?: "flat" | "raised-xs" | "raised-sm" | "floating";
  interactive?: boolean;
}

export function SurfaceCard({
  className,
  variant = "ceramic",
  elevation = "raised-xs",
  interactive = false,
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

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    x.set(0);
    y.set(0);
  };

  const cardClasses = cn(
    "rounded-2xl transition-all duration-200",
    variantStyles[variant],
    elevation !== "flat" && elevationStyles[elevation],
    className
  );

  if (interactive) {
    return (
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(cardClasses, "will-change-transform")}
        {...props}
      >
        {/* Adds an inner element to push content forward for 3D effect */}
        <div style={{ transform: "translateZ(40px)" }}>
          {children}
        </div>
      </motion.div>
    );
  }

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
}
