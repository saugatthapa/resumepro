"use client";

import { Lock } from "lucide-react";
import type { ResumeTemplate } from "@/lib/templates";
import { cn } from "@/lib/utils";

export function TemplateCard({
  template,
  selected,
  locked,
  onSelect
}: {
  template: ResumeTemplate;
  selected: boolean;
  locked: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative rounded-xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
        selected ? "border-brand-500 ring-4 ring-brand-100" : "border-slate-200"
      )}
    >
      <div className={cn("space-y-3", locked && "blur-[1.5px]")}>
        <div className="h-24 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="h-2 w-24 rounded-full" style={{ backgroundColor: template.accent }} />
          <div className="mt-3 h-2 w-32 rounded-full bg-slate-300" />
          <div className="mt-2 h-2 w-20 rounded-full bg-slate-200" />
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="h-2 rounded-full bg-slate-200" />
            <div className="h-2 rounded-full bg-slate-200" />
            <div className="h-2 rounded-full bg-slate-200" />
            <div className="h-2 rounded-full bg-slate-200" />
          </div>
        </div>
        <div>
          <p className="font-semibold text-slate-950">{template.name}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{template.description}</p>
        </div>
      </div>
      {locked ? (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-slate-950 px-2 py-1 text-xs font-semibold text-white">
          <Lock className="h-3 w-3" />
          Pro
        </span>
      ) : null}
    </button>
  );
}
