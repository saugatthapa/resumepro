import type { Metadata } from "next";
import { SEOContentPage } from "@/components/SEOContentPage";

export const metadata: Metadata = {
  title: "Resume Headline Generator",
  description:
    "Create a clear resume headline that communicates your role, strengths, and target job positioning."
};

export default function ResumeHeadlineGeneratorPage() {
  return (
    <SEOContentPage
      title="Resume Headline Generator"
      intro="A resume headline is the short phrase near the top of your resume that tells the reader what kind of candidate they are looking at. ResumePro helps you build a headline that is specific, role-aware, and easy to scan."
      ctaHref="/resume-builder"
      ctaLabel="Create your resume headline"
      sections={[
        {
          heading: "What a resume headline is",
          body: "A resume headline is usually one line under your name. It might say Senior Product Designer, Data Analyst, Customer Success Manager, Full Stack Engineer, Operations Leader, or another clear professional identity. The headline can also include a specialty when that improves fit, such as B2B SaaS Product Designer, Revenue Operations Analyst, or Frontend Engineer with React and TypeScript. The goal is not to be clever. The goal is to reduce ambiguity so recruiters immediately understand the lane you are in and why the resume is relevant."
        },
        {
          heading: "Why specificity beats vague branding",
          body: "Some candidates use broad headlines like results-driven professional or dynamic leader. These phrases sound positive, but they do not tell the reader enough. A hiring team looking for a financial analyst, UX researcher, or sales development representative needs a direct match. Specific headlines also help ATS tools because the target title and major keywords are visible near the top. If you are changing careers, the headline should point toward the new role while using credible bridge language from your background."
        },
        {
          heading: "How to write a strong headline",
          body: "Choose the title closest to the role you want next. Add one or two differentiators only if they are meaningful. A strong format is target title plus specialty, industry, toolset, or business outcome. Examples include Operations Manager | Process Improvement and Team Leadership, Marketing Analyst | SQL, Lifecycle Campaigns, and Reporting, or Software Engineer | React, Node.js, and Product Delivery. Avoid cramming too much into the line. The headline should remain readable on mobile, in PDF previews, and in quick recruiter scans."
        },
        {
          heading: "Using the headline with the rest of the resume",
          body: "The headline sets expectations, so the rest of the resume should support it. If your headline says project manager, the experience section should show timelines, stakeholders, budgets, delivery, and risk management. If it says data analyst, the resume should show analysis tools, datasets, metrics, dashboards, and decisions influenced by your work. When the headline and bullets point in the same direction, the whole resume feels more coherent. ResumePro makes this easier by showing the live preview while you edit."
        },
        {
          heading: "How ResumePro helps",
          body: "ResumePro gives you a structured resume builder where the job title field works as the headline in the preview. You can pair that headline with AI-generated summaries, tailored skills, ATS checks, and professional templates. Free users can start with clean templates and a watermarked export. Pro users can unlock premium layouts and remove the watermark. The headline is a small piece of the document, but when it is precise, it helps every other section work harder."
        }
      ]}
    />
  );
}
