import type { LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Label({
  className,
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { children: ReactNode }) {
  return (
    <label className={cn("text-sm font-semibold text-slate-800", className)} {...props}>
      {children}
    </label>
  );
}
