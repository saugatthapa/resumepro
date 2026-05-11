import type { Metadata } from "next";
import { SEOContentPage } from "@/components/SEOContentPage";

export const metadata: Metadata = {
  title: "Resume Summary Generator",
  description:
    "Learn how to write a strong resume summary and use ResumePro to generate ATS-friendly summaries for your target role."
};

export default function ResumeSummaryGeneratorPage() {
  return (
    <SEOContentPage
      title="Resume Summary Generator"
      intro="A strong resume summary gives recruiters the fastest possible answer to one question: why should this candidate be considered for this job? ResumePro helps you turn your role, skills, and experience into a focused summary that is readable for people and friendly to applicant tracking systems."
      ctaHref="/resume-builder"
      ctaLabel="Generate a resume summary"
      sections={[
        {
          heading: "What a resume summary should do",
          body: "Your resume summary should not repeat every detail from your work history. It should frame the rest of the resume. The best summaries state your professional identity, name the type of value you create, include a few relevant skills, and show enough specificity that the paragraph feels connected to the job. A software engineer might lead with product engineering, TypeScript, performance, and cross-functional delivery. A customer success manager might lead with retention, onboarding, stakeholder communication, and expansion revenue. The summary should make the reader want to keep scanning because the fit is already visible."
        },
        {
          heading: "How to make it ATS friendly",
          body: "Applicant tracking systems rely heavily on words from the job description. A summary is a useful place to include important keywords naturally, especially job titles, tools, industries, and core responsibilities. That does not mean stuffing the paragraph with a long list of terms. Instead, choose the phrases that matter most and write a sentence that still sounds like a person. If a posting mentions lifecycle marketing, SQL, segmentation, and experimentation, a strong summary can mention those ideas while explaining the outcome you drive. ResumePro pairs this with an ATS checker so you can see what is missing before you apply."
        },
        {
          heading: "What to include before generating",
          body: "Before using a resume summary generator, collect the basics: your target job title, the industries or products you understand, your strongest skills, and two or three achievements that prove your level. Good inputs create better output. Instead of saying you are experienced in sales, say you manage enterprise deals, build pipeline, use Salesforce, and exceed quota in competitive markets. Instead of saying you are a designer, mention product design, research, prototypes, design systems, and measurable usability improvements. Specific inputs give AI enough signal to create a summary that feels credible."
        },
        {
          heading: "Common summary mistakes",
          body: "Many summaries are too generic. Phrases like hard working, passionate, motivated, or team player do not hurt by themselves, but they rarely help unless they are tied to evidence. Another common mistake is writing a summary that is too long. Recruiters usually scan quickly, so four focused lines are stronger than a dense block. A third mistake is using a summary for career goals only. Employers care most about the role they need to fill. Your goals can matter, but the summary should first explain your fit, strengths, and likely contribution."
        },
        {
          heading: "How ResumePro helps",
          body: "ResumePro combines AI writing with resume structure. You can draft a professional summary, place it directly into a resume template, check the full resume against a job description, and export a PDF. Free users can create a resume and use limited AI generations, while Pro users can iterate more, unlock premium templates, remove the PDF watermark, and use advanced ATS analysis. The result is a smoother workflow: write the summary, review the preview, score the resume, improve weak areas, and apply with a document that feels deliberate."
        }
      ]}
    />
  );
}
