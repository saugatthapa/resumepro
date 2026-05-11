"use client";

import { forwardRef } from "react";
import type { ResumeData } from "@/lib/resume";
import { getTemplateById } from "@/lib/templates";
import { cn } from "@/lib/utils";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h3 className="border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
        {title}
      </h3>
      <div className="mt-2 text-sm leading-6 text-slate-700">{children}</div>
    </section>
  );
}

type ResumePreviewProps = {
  data: ResumeData;
  templateId: string;
  watermark?: boolean;
  className?: string;
};

export const ResumePreview = forwardRef<HTMLElement, ResumePreviewProps>(function ResumePreview(
  { data, templateId, watermark = false, className },
  ref
) {
  const template = getTemplateById(templateId);

  return (
    <article
      ref={ref}
      className={cn(
        "resume-paper relative mx-auto min-h-[920px] w-full max-w-[760px] overflow-hidden rounded-xl border border-slate-200 p-8 text-slate-950",
        className
      )}
    >
      {watermark ? (
        <div className="pointer-events-none absolute inset-0 flex rotate-[-28deg] items-center justify-center text-5xl font-black uppercase tracking-wider text-slate-200/70">
          Created with ResumePro
        </div>
      ) : null}
      <div className="relative">
        <div className="h-2 w-28 rounded-full" style={{ backgroundColor: template.accent }} />
        <header className="mt-5">
          <h1 className="text-3xl font-bold tracking-tight">
            {data.fullName || "Your Name"}
          </h1>
          <p className="mt-1 text-lg font-semibold" style={{ color: template.accent }}>
            {data.jobTitle || "Target Job Title"}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {[data.email, data.phone, data.location, data.website].filter(Boolean).join(" | ") ||
              "email@example.com | (555) 123-4567 | City, ST | linkedin.com/in/you"}
          </p>
        </header>

        <Section title="Professional Summary">
          <p>
            {data.summary ||
              "Results-driven professional with experience aligning business needs, user outcomes, and measurable execution."}
          </p>
        </Section>

        <Section title="Skills">
          <div className="flex flex-wrap gap-2">
            {(data.skills.length ? data.skills : ["Leadership", "Communication", "Analytics"]).map((skill) => (
              <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {skill}
              </span>
            ))}
          </div>
        </Section>

        <Section title="Work Experience">
          <div className="space-y-4">
            {data.workExperience.map((job, index) => (
              <div key={`${job.company}-${index}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-bold text-slate-950">
                    {job.role || "Role"} {job.company ? `- ${job.company}` : ""}
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    {[job.startDate, job.endDate].filter(Boolean).join(" - ")}
                  </p>
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {(job.bullets.length ? job.bullets : ["Improved key outcomes through measurable execution."])
                    .filter(Boolean)
                    .map((bullet, bulletIndex) => (
                      <li key={`${bullet}-${bulletIndex}`}>{bullet}</li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Education">
          <div className="space-y-2">
            {data.education.map((item, index) => (
              <p key={`${item.school}-${index}`}>
                <span className="font-semibold text-slate-950">{item.degree || "Degree"}</span>
                {item.school ? `, ${item.school}` : ""}
              </p>
            ))}
          </div>
        </Section>

        {data.projects.filter((project) => project.name || project.description).length > 0 ? (
          <Section title="Projects">
            <div className="space-y-2">
              {data.projects.map((project, index) => (
                <p key={`${project.name}-${index}`}>
                  <span className="font-semibold text-slate-950">{project.name}</span>
                  {project.description ? ` - ${project.description}` : ""}
                </p>
              ))}
            </div>
          </Section>
        ) : null}

        {data.certifications.length > 0 ? (
          <Section title="Certifications">
            <p>{data.certifications.join(", ")}</p>
          </Section>
        ) : null}
      </div>
    </article>
  );
});
