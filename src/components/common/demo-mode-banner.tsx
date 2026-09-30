import * as React from "react";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DemoModeBannerProps {
  compact?: boolean;
  className?: string;
}

export function DemoModeBanner({ compact = false, className }: DemoModeBannerProps) {
  if (compact) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-800 border border-amber-500/20 select-none",
          className
        )}
      >
        <span className="h-2 w-2 rounded-full bg-amber-500" />
        <span>Demo Mode • Simulated Data</span>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Demo environment disclosure"
      className={cn(
        "rounded-xl border border-amber-500/25 bg-amber-500/[0.07] px-4 py-3 text-amber-900 text-xs sm:text-sm",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-1">
          <div className="font-semibold flex items-center gap-2">
            <span>Demo Mode — Simulated Data Only</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-200/80 text-amber-800 uppercase tracking-wider font-bold">
              Solana Devnet
            </span>
          </div>
          <p className="text-amber-800/90 leading-relaxed text-xs">
            Ví Solana Devnet có thể được kết nối để kiểm thử. <strong>Escrow on-chain chưa được triển khai; chưa có giao dịch ký quỹ.</strong> Memo proof có thể được ghi nhận trên mạng nhưng không chuyển giá trị. Không có giá trị tiền thật và không phải Mainnet.
          </p>
        </div>
      </div>
    </div>
  );
}
