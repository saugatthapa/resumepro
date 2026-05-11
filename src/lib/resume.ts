import { z } from "zod";

export const workExperienceSchema = z.object({
  company: z.string().optional().default(""),
  role: z.string().optional().default(""),
  startDate: z.string().optional().default(""),
  endDate: z.string().optional().default(""),
  bullets: z.array(z.string()).optional().default([])
});

export const educationSchema = z.object({
  school: z.string().optional().default(""),
  degree: z.string().optional().default(""),
  startDate: z.string().optional().default(""),
  endDate: z.string().optional().default("")
});

export const projectSchema = z.object({
  name: z.string().optional().default(""),
  description: z.string().optional().default("")
});

export const resumeDataSchema = z.object({
  fullName: z.string().optional().default(""),
  jobTitle: z.string().optional().default(""),
  email: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  location: z.string().optional().default(""),
  website: z.string().optional().default(""),
  summary: z.string().optional().default(""),
  skills: z.array(z.string()).optional().default([]),
  workExperience: z.array(workExperienceSchema).optional().default([]),
  education: z.array(educationSchema).optional().default([]),
  projects: z.array(projectSchema).optional().default([]),
  certifications: z.array(z.string()).optional().default([])
});

export type ResumeData = z.infer<typeof resumeDataSchema>;

export type SavedResume = {
  id: string;
  title: string;
  templateId: string;
  data: ResumeData;
  createdAt: string;
  updatedAt: string;
};

export const emptyResumeData: ResumeData = {
  fullName: "",
  jobTitle: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  summary: "",
  skills: [],
  workExperience: [
    {
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      bullets: [""]
    }
  ],
  education: [
    {
      school: "",
      degree: "",
      startDate: "",
      endDate: ""
    }
  ],
  projects: [{ name: "", description: "" }],
  certifications: []
};

export function parseResumeData(value: unknown): ResumeData {
  return resumeDataSchema.parse(value ?? {});
}

export function resumeToText(data: ResumeData) {
  const work = data.workExperience
    .map((item) => `${item.role} ${item.company} ${item.bullets.join(" ")}`)
    .join("\n");
  const education = data.education.map((item) => `${item.degree} ${item.school}`).join("\n");
  const projects = data.projects.map((item) => `${item.name} ${item.description}`).join("\n");

  return [
    data.fullName,
    data.jobTitle,
    data.email,
    data.phone,
    data.location,
    data.website,
    data.summary,
    data.skills.join(", "),
    work,
    education,
    projects,
    data.certifications.join(", ")
  ]
    .filter(Boolean)
    .join("\n");
}

export function listFromText(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}
