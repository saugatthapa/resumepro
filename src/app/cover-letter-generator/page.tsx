import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { CoverLetterClient } from "./CoverLetterClient";

export const metadata: Metadata = {
  title: "Cover Letter Generator",
  description: "Generate a concise, customized cover letter with ResumePro and Groq AI."
};

export default async function CoverLetterGeneratorPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/signin?callbackUrl=/cover-letter-generator");
  }

  return <CoverLetterClient userName={user.name} userPlan={user.plan} />;
}
