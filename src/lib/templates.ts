import type { Plan } from "@prisma/client";

export type ResumeTemplate = {
  id: string;
  name: string;
  tier: "free" | "pro";
  description: string;
  accent: string;
};

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: "classic-clean",
    name: "Classic Clean",
    tier: "free",
    description: "Traditional structure with excellent readability.",
    accent: "#2563eb"
  },
  {
    id: "simple-modern",
    name: "Simple Modern",
    tier: "free",
    description: "A crisp modern layout for general applications.",
    accent: "#0891b2"
  },
  {
    id: "executive-pro",
    name: "Executive Pro",
    tier: "pro",
    description: "Polished leadership layout with stronger section emphasis.",
    accent: "#4f46e5"
  },
  {
    id: "tech-minimal",
    name: "Tech Minimal",
    tier: "pro",
    description: "Compact, scannable, and tuned for technical roles.",
    accent: "#0f766e"
  },
  {
    id: "creative-edge",
    name: "Creative Edge",
    tier: "pro",
    description: "Expressive accents for creative and brand roles.",
    accent: "#db2777"
  },
  {
    id: "corporate-elite",
    name: "Corporate Elite",
    tier: "pro",
    description: "Premium corporate styling for senior professionals.",
    accent: "#7c3aed"
  }
];

export const defaultTemplateId = "classic-clean";

export function getTemplateById(templateId?: string | null) {
  return resumeTemplates.find((template) => template.id === templateId) ?? resumeTemplates[0];
}

export function canUseTemplate(plan: Plan, templateId: string) {
  const template = getTemplateById(templateId);
  return template.tier === "free" || plan === "PRO";
}
