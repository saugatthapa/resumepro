import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3, FileText, PenLine, Search, Sparkles } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { SignOutButton } from "@/components/SignOutButton";
import { UsageBadge } from "@/components/UsageBadge";
import { LinkButton } from "@/components/ui/Button";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseResumeData } from "@/lib/resume";
import { getTodayUsage } from "@/lib/usage";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your ResumePro resumes, AI usage, ATS checks, cover letters, and billing."
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  const [usage, resumes] = await Promise.all([
    getTodayUsage(user.id),
    prisma.resume.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" }
    })
  ]);

  return (
    <section className="bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Dashboard</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Welcome, {user.name}</h1>
            <p className="mt-2 text-slate-600">Create, score, export, and improve your job search documents.</p>
          </div>
          <SignOutButton />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white">
            Current plan: {user.plan}
          </span>
          <UsageBadge usage={usage} plan={user.plan} />
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <DashboardCard
            title="Resume count"
            value={String(resumes.length)}
            description={user.plan === "PRO" ? "Unlimited resumes enabled." : "Free plan includes one saved resume."}
            icon={<FileText className="h-5 w-5" />}
          />
          <DashboardCard
            title="AI usage today"
            value={String(usage.aiGenerations)}
            description="Used for summaries, skills, cover letters, and improved bullets."
            icon={<Sparkles className="h-5 w-5" />}
          />
          <DashboardCard
            title="ATS checks today"
            value={String(usage.atsChecks)}
            description="Rule-based resume scoring against job descriptions."
            icon={<BarChart3 className="h-5 w-5" />}
          />
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <LinkButton href="/resume-builder" size="lg">
            <PenLine className="h-5 w-5" />
            Build Resume
          </LinkButton>
          <LinkButton href="/ats-checker" size="lg" variant="outline">
            <Search className="h-5 w-5" />
            Check ATS Score
          </LinkButton>
          <LinkButton href="/cover-letter-generator" size="lg" variant="outline">
            <FileText className="h-5 w-5" />
            Generate Cover Letter
          </LinkButton>
          <LinkButton href="/pricing" size="lg" variant="secondary">
            <Sparkles className="h-5 w-5" />
            Upgrade to Pro
          </LinkButton>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">Saved resumes</h2>
              <p className="mt-1 text-sm text-slate-600">Open the builder to edit and export.</p>
            </div>
            <Link href="/resume-builder" className="text-sm font-bold text-brand-600 hover:text-brand-700">
              New resume
            </Link>
          </div>
          <div className="mt-6 divide-y divide-slate-100">
            {resumes.length === 0 ? (
              <div className="rounded-xl bg-slate-50 p-8 text-center">
                <p className="font-semibold text-slate-950">No resumes yet</p>
                <p className="mt-2 text-sm text-slate-600">Build your first free resume in a few minutes.</p>
              </div>
            ) : (
              resumes.map((resume) => {
                const data = parseResumeData(resume.data);
                return (
                  <div key={resume.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                    <div>
                      <p className="font-bold text-slate-950">{resume.title}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {data.jobTitle || "Untitled role"} | Template: {resume.templateId}
                      </p>
                    </div>
                    <LinkButton href={`/resume-builder?resumeId=${resume.id}`} variant="outline" size="sm">
                      Edit
                    </LinkButton>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
