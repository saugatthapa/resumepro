"use client";

import { X, Sparkles } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/Button";

export function UpgradeModal({
  open,
  title = "Unlock ResumePro Pro",
  message = "Upgrade to remove limits, export clean PDFs, use premium templates, and get advanced ATS analysis.",
  onClose
}: {
  open: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-brand-50 p-3 text-brand-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950">{title}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">{message}</p>
            </div>
          </div>
          <button
            aria-label="Close upgrade modal"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <LinkButton href="/pricing" className="w-full">
            Upgrade
          </LinkButton>
          <Button type="button" variant="outline" className="w-full" onClick={onClose}>
            Keep editing
          </Button>
        </div>
      </div>
    </div>
  );
}
