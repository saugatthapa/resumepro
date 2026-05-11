import type { Usage } from "@prisma/client";
import { planLimits } from "@/lib/plans";

export function UsageBadge({ usage, plan }: { usage: Usage; plan: "FREE" | "PRO" }) {
  const limits = planLimits[plan];
  const aiLimit = Number.isFinite(limits.aiGenerationsPerDay)
    ? `${usage.aiGenerations}/${limits.aiGenerationsPerDay}`
    : `${usage.aiGenerations}/Unlimited`;
  const coverLetterLimit = Number.isFinite(limits.coverLettersPerDay)
    ? `${usage.coverLetters}/${limits.coverLettersPerDay}`
    : `${usage.coverLetters}/Unlimited`;

  return (
    <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
      <span>AI today: {aiLimit}</span>
      <span className="h-1 w-1 rounded-full bg-slate-300" />
      <span>Cover letters: {coverLetterLimit}</span>
    </div>
  );
}
