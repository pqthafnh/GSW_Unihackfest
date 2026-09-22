import * as React from "react";
import { cn } from "@/lib/utils";
import { GigStatus } from "@/contracts";
import {
  FileEdit,
  Lock,
  Hourglass,
  Coins,
  UserCheck,
  UploadCloud,
  CheckCircle,
  FileCheck2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  status: GigStatus | string;
  size?: "sm" | "md";
}

export function StatusIndicator({
  status,
  size = "md",
  className,
  ...props
}: StatusIndicatorProps) {
  const getStatusConfig = (s: string) => {
    switch (s) {
      case "DRAFT":
        return {
          label: "Draft",
          icon: <FileEdit className="w-3.5 h-3.5" />,
          colorClass: "text-neutral-600 bg-neutral-100 border-neutral-200",
        };
      case "TERMS_LOCKED":
        return {
          label: "Terms Locked",
          icon: <Lock className="w-3.5 h-3.5" />,
          colorClass: "text-blue-700 bg-blue-50 border-blue-200",
        };
      case "FUNDING_PENDING":
        return {
          label: "Funding Pending",
          icon: <Hourglass className="w-3.5 h-3.5" />,
          colorClass: "text-amber-700 bg-amber-50 border-amber-200",
        };
      case "FUNDED":
        return {
          label: "Escrow Funded",
          icon: <Coins className="w-3.5 h-3.5" />,
          colorClass: "text-emerald-700 bg-emerald-50 border-emerald-200",
        };
      case "CLAIMED":
        return {
          label: "In Progress",
          icon: <UserCheck className="w-3.5 h-3.5" />,
          colorClass: "text-indigo-700 bg-indigo-50 border-indigo-200",
        };
      case "SUBMITTED":
        return {
          label: "Submitted (Under Review)",
          icon: <UploadCloud className="w-3.5 h-3.5" />,
          colorClass: "text-amber-800 bg-amber-50 border-amber-300",
        };
      case "SETTLEMENT_PENDING":
        return {
          label: "Settling...",
          icon: <Hourglass className="w-3.5 h-3.5" />,
          colorClass: "text-blue-700 bg-blue-50 border-blue-200",
        };
      case "SETTLED":
      case "COMPLETED":
        return {
          label: "Settled & Verified",
          icon: <CheckCircle className="w-3.5 h-3.5" />,
          colorClass: "text-emerald-800 bg-emerald-50 border-emerald-300",
        };
      case "RECEIPT_PENDING":
        return {
          label: "Receipt Pending",
          icon: <FileCheck2 className="w-3.5 h-3.5" />,
          colorClass: "text-blue-700 bg-blue-50 border-blue-200",
        };
      case "REVISION_REQUESTED":
        return {
          label: "Revision Requested",
          icon: <RotateCcw className="w-3.5 h-3.5" />,
          colorClass: "text-orange-700 bg-orange-50 border-orange-200",
        };
      case "DISPUTED":
        return {
          label: "Disputed",
          icon: <AlertTriangle className="w-3.5 h-3.5" />,
          colorClass: "text-rose-700 bg-rose-50 border-rose-200",
        };
      default:
        return {
          label: s,
          icon: <Hourglass className="w-3.5 h-3.5" />,
          colorClass: "text-neutral-700 bg-neutral-50 border-neutral-200",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-medium",
        size === "sm" ? "text-xs py-0.5 px-2" : "text-xs py-1 px-3",
        config.colorClass,
        className
      )}
      {...props}
    >
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
}
