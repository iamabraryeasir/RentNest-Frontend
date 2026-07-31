import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColorClass: string;
  iconBgClass: string;
  glowColorClass?: string;
  footer: ReactNode;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColorClass,
  iconBgClass,
  glowColorClass = "bg-primary/5",
  footer,
}: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card p-5 shadow-xs transition-all duration-200 hover:shadow-md select-none">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className="text-3xl font-black text-foreground">{value}</p>
        </div>
        <div className={`rounded-xl p-3 ${iconBgClass} ${iconColorClass}`}>
          <Icon className="size-5" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        {footer}
      </div>
      {/* Subtle gradient glow */}
      <div
        className={`absolute -right-6 -bottom-6 size-24 rounded-full blur-xl pointer-events-none ${glowColorClass}`}
      />
    </div>
  );
}
