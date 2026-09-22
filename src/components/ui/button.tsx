import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "dark" | "pearl" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  href?: string;
  external?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      href,
      external,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.97]";

    const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
      primary:
        "bg-[#0066cc] text-white rounded-full shadow-[0_2px_6px_rgba(0,102,204,0.25)] hover:bg-[#0055aa] active:bg-[#004499]",
      secondary:
        "bg-transparent text-[#0066cc] border border-[#0066cc] rounded-full hover:bg-[#0066cc]/5 active:bg-[#0066cc]/10",
      dark:
        "bg-[#1d1d1f] text-white rounded-lg shadow-sm hover:bg-[#2d2d2f] active:bg-[#111112]",
      pearl:
        "bg-[#fafafc] text-[#1d1d1f] border border-neutral-200/80 rounded-md hover:bg-neutral-100/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]",
      ghost:
        "bg-transparent text-[#1d1d1f] hover:bg-neutral-100 rounded-full",
      link:
        "bg-transparent text-[#0066cc] hover:underline p-0 h-auto rounded-none min-h-0",
    };

    const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
      sm: "min-h-[36px] px-3.5 py-1.5 text-xs tracking-tight",
      md: "min-h-[44px] px-5 py-2 text-sm tracking-tight",
      lg: "min-h-[50px] px-7 py-3 text-base tracking-tight font-semibold",
      icon: "min-h-[44px] min-w-[44px] p-2.5 rounded-full",
    };

    const combinedClassName = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    if (href) {
      if (external) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={combinedClassName}
          >
            {children}
          </a>
        );
      }
      return (
        <Link href={href} className={combinedClassName}>
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={combinedClassName}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
