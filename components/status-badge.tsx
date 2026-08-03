import type { DashboardStatus as StatusType } from "@/types";

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/25",
  AVAILABLE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/25",
  PAID: "bg-emerald-500/10 text-emerald-600 border-emerald-500/25",

  APPROVED: "bg-blue-500/10 text-blue-600 border-blue-500/25",
  RENTED: "bg-blue-500/10 text-blue-600 border-blue-500/25",

  PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/25",

  REJECTED: "bg-red-500/10 text-red-600 border-red-500/25",
  UNAVAILABLE: "bg-red-500/10 text-red-600 border-red-500/25",
  BLOCKED: "bg-red-500/10 text-red-600 border-red-500/25",
  FAILED: "bg-red-500/10 text-red-600 border-red-500/25",

  COMPLETED: "bg-zinc-500/10 text-zinc-600 border-zinc-500/25",
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const normalizedStatus = status.toUpperCase() as StatusType;
  const styleClass =
    statusStyles[normalizedStatus] ||
    "bg-muted text-muted-foreground border-border";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border transition-colors ${styleClass} ${className}`}
    >
      {status}
    </span>
  );
}
