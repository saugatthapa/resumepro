import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseResumeData, type SavedResume } from "@/lib/resume";
import { ResumeBuilderClient } from "./ResumeBuilderClient";

export const metadata: Metadata = {
  title: "Resume Builder",
  description: "Build, preview, save, and export an ATS-friendly ResumePro resume."
};

export default async function ResumeBuilderPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/signin?callbackUrl=/resume-builder");
  }

  const resumes = await prisma.resume.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" }
  });

  const savedResumes: SavedResume[] = resumes.map((resume) => ({
    id: resume.id,
    title: resume.title,
    templateId: resume.templateId,
    data: parseResumeData(resume.data),
    createdAt: resume.createdAt.toISOString(),
    updatedAt: resume.updatedAt.toISOString()
  }));

  return <ResumeBuilderClient userPlan={user.plan} initialResumes={savedResumes} />;
}
