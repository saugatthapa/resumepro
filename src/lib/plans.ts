import type { Plan } from "@prisma/client";

export type Feature =
  | "resume"
  | "ai"
  | "coverLetter"
  | "ats"
  | "download"
  | "premiumTemplate"
  | "advancedAts"
  | "noWatermark";

export const planCopy: Record<Plan, { label: string; description: string }> = {
  FREE: {
    label: "Free",
    description: "Create one resume with basic AI, ATS checks, and watermarked PDF export."
  },
  PRO: {
    label: "Pro",
    description: "Unlimited resumes, premium templates, more AI, advanced ATS, and clean PDFs."
  }
};

export const planLimits = {
  FREE: {
    resumes: 1,
    aiGenerationsPerDay: 3,
    coverLettersPerDay: 1,
    atsChecksPerDay: 10,
    resumeDownloadsPerDay: 10
  },
  PRO: {
    resumes: Number.POSITIVE_INFINITY,
    aiGenerationsPerDay: Number.POSITIVE_INFINITY,
    coverLettersPerDay: Number.POSITIVE_INFINITY,
    atsChecksPerDay: Number.POSITIVE_INFINITY,
    resumeDownloadsPerDay: Number.POSITIVE_INFINITY
  }
} satisfies Record<Plan, Record<string, number>>;

export function isPro(plan?: Plan | null) {
  return plan === "PRO";
}

export function formatLimit(value: number) {
  return Number.isFinite(value) ? String(value) : "Unlimited";
}
