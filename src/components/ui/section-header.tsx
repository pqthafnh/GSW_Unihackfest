import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center" | "right";
  onDark?: boolean;
}

export function SectionHeader({
  className,
  eyebrow,
  title,
  description,
  align = "center",
  onDark = false,
  children,
  ...props
}: SectionHeaderProps) {
  const alignStyles = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  };

  return (
    <div
      className={cn(
        "flex flex-col max-w-3xl space-y-3 mb-12",
        alignStyles[align],
        className
      )}
      {...props}
    >
      {eyebrow && (
        <span
          className={cn(
            "text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full border",
            onDark
              ? "text-[#2997ff] bg-[#2997ff]/10 border-[#2997ff]/20"
              : "text-[#0066cc] bg-[#0066cc]/10 border-[#0066cc]/20"
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.03em] leading-tight",
          onDark ? "text-white" : "text-[#1d1d1f]"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-base sm:text-lg leading-relaxed max-w-2xl font-normal",
            onDark ? "text-neutral-400" : "text-neutral-600"
          )}
        >
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
