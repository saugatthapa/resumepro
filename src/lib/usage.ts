import type { Plan, Usage } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { planLimits, type Feature } from "@/lib/plans";

export function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export async function getTodayUsage(userId: string) {
  const date = startOfToday();
  return prisma.usage.upsert({
    where: {
      userId_date: {
        userId,
        date
      }
    },
    create: {
      userId,
      date
    },
    update: {}
  });
}

export async function incrementUsage(
  userId: string,
  field: "aiGenerations" | "resumeDownloads" | "atsChecks" | "coverLetters",
  amount = 1
) {
  const usage = await getTodayUsage(userId);
  return prisma.usage.update({
    where: { id: usage.id },
    data: {
      [field]: {
        increment: amount
      }
    }
  });
}

type CanUseInput = {
  plan: Plan;
  usage: Usage;
  feature: Feature;
  resumeCount?: number;
};

export function canUseFeature({ plan, usage, feature, resumeCount = 0 }: CanUseInput) {
  const limits = planLimits[plan];

  if (plan === "PRO") {
    return { allowed: true, reason: null };
  }

  if (feature === "resume" && resumeCount >= limits.resumes) {
    return {
      allowed: false,
      reason: "Free users can save one resume. Upgrade to Pro for unlimited resumes."
    };
  }

  if (feature === "ai" && usage.aiGenerations >= limits.aiGenerationsPerDay) {
    return {
      allowed: false,
      reason: "You reached today's free AI generation limit. Upgrade to Pro for more AI."
    };
  }

  if (feature === "coverLetter" && usage.coverLetters >= limits.coverLettersPerDay) {
    return {
      allowed: false,
      reason: "Free users can generate one cover letter per day. Upgrade to Pro for unlimited letters."
    };
  }

  if (feature === "ats" && usage.atsChecks >= limits.atsChecksPerDay) {
    return {
      allowed: false,
      reason: "You reached today's ATS check limit. Upgrade to Pro for more checks."
    };
  }

  if (["premiumTemplate", "advancedAts", "noWatermark"].includes(feature)) {
    return {
      allowed: false,
      reason: "This is a Pro feature."
    };
  }

  return { allowed: true, reason: null };
}
