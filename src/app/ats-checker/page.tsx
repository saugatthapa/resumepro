import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseResumeData, resumeToText } from "@/lib/resume";
import { ATSCheckerClient } from "./ATSCheckerClient";

export const metadata: Metadata = {
  title: "ATS Checker",
  description: "Score your resume against a job description with ResumePro's rule-based ATS engine."
};

export default async function ATSCheckerPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/signin?callbackUrl=/ats-checker");
  }

  const resumes = await prisma.resume.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <ATSCheckerClient
      userPlan={user.plan}
      savedResumes={resumes.map((resume) => ({
        id: resume.id,
        title: resume.title,
        text: resumeToText(parseResumeData(resume.data))
      }))}
    />
  );
}
