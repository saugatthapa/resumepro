import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function DashboardCard({
  title,
  value,
  description,
  icon,
  className
}: {
  title: string;
  value: string;
  description: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-5 shadow-sm", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
        </div>
        {icon ? <div className="rounded-lg bg-brand-50 p-2 text-brand-600">{icon}</div> : null}
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
