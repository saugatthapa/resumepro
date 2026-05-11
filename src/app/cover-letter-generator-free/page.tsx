import type { Metadata } from "next";
import { SEOContentPage } from "@/components/SEOContentPage";

export const metadata: Metadata = {
  title: "Free Cover Letter Generator",
  description:
    "Generate a concise, customized cover letter for a job title, company, skills, and job description."
};

export default function CoverLetterGeneratorFreePage() {
  return (
    <SEOContentPage
      title="Free Cover Letter Generator"
      intro="A good cover letter connects your experience to the employer's needs without repeating your entire resume. ResumePro helps you generate a concise letter that uses the job title, company name, skills, and job description as context."
      ctaHref="/cover-letter-generator"
      ctaLabel="Generate a cover letter"
      sections={[
        {
          heading: "What a cover letter should accomplish",
          body: "A cover letter should make the connection between your resume and the job feel obvious. It should explain why the role interests you, show that you understand the company's needs, and highlight two or three strengths that make you credible. The strongest letters are specific without becoming long. They mention the role, company, relevant skills, and a few proof points. They do not restate every job you have held. Instead, they give the hiring team a short narrative that makes your resume easier to interpret."
        },
        {
          heading: "Why customization matters",
          body: "Generic cover letters are easy to spot. A customized letter references the job description and uses language that matches the employer's priorities. If the posting emphasizes customer onboarding, retention, and cross-functional communication, the letter should not focus only on general enthusiasm. It should connect your experience to onboarding, retention, and collaboration. ResumePro asks for the job title, company, skills, job description, and tone so the generated letter can be more targeted than a blank template."
        },
        {
          heading: "Choosing the right tone",
          body: "Different roles call for different tones. A professional tone works well for corporate, finance, operations, legal, and administrative roles. A friendly tone can fit customer-facing, nonprofit, education, and community roles. A confident tone is useful when your background strongly matches the job and you want to lead with impact. Tone should never become exaggerated. A cover letter should sound like a capable person who understands the role, respects the reader's time, and can explain their value in plain language."
        },
        {
          heading: "How long should it be",
          body: "Most cover letters should be short. Three to five paragraphs are usually enough: an opening that names the role, a middle section that connects your experience to the job, and a closing that reinforces interest. Long letters often reduce clarity. Recruiters and hiring managers are busy, so a concise letter with specific details is more useful than a page of broad claims. ResumePro is designed to generate concise letters, which you can then personalize further before submitting."
        },
        {
          heading: "How ResumePro helps",
          body: "ResumePro includes a free cover letter workflow with daily limits for Free users and expanded access for Pro users. The generator uses Groq through a secure server route, so API keys are never exposed to the browser. You can create a letter, compare the language to your resume, and use the ATS checker to make sure your resume still aligns with the role. Pro unlocks unlimited cover letters, more AI generations, premium templates, advanced ATS analysis, and no-watermark PDF exports."
        }
      ]}
    />
  );
}
