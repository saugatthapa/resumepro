import type { Metadata } from "next";
import { SEOContentPage } from "@/components/SEOContentPage";

export const metadata: Metadata = {
  title: "ATS Resume Checker",
  description:
    "Check your resume against a job description with keyword, skills, section, readability, and contact scoring."
};

export default function ATSResumeCheckerPage() {
  return (
    <SEOContentPage
      title="ATS Resume Checker"
      intro="An ATS resume checker helps you understand whether your resume reflects the language and structure of a job description. ResumePro uses a transparent rule-based engine so you can see what improved the score and what still needs attention."
      ctaHref="/ats-checker"
      ctaLabel="Check your ATS score"
      sections={[
        {
          heading: "What ATS systems look for",
          body: "Applicant tracking systems help employers organize applications. They may parse contact information, section headings, work history, education, skills, and job-related keywords. A resume that looks beautiful but hides important information in unusual formatting can be harder for software to interpret. The safest approach is a clean structure, standard headings, readable text, and keywords that honestly match your experience. ResumePro templates are designed to be professional and scannable, which helps both software and human reviewers."
        },
        {
          heading: "Why job descriptions matter",
          body: "ATS alignment is specific to each role. A resume might be strong for one job and weak for another because the language, tools, and responsibilities differ. That is why ResumePro compares your resume text to a pasted job description. The engine extracts important terms, checks which ones appear in the resume, and highlights missing keywords. This does not mean every keyword should be copied. It means your resume should use the same professional vocabulary when your experience genuinely supports it."
        },
        {
          heading: "The ResumePro scoring model",
          body: "The ATS checker calculates a score out of 100 using five categories: keyword match, skills match, section completeness, readability and length, and contact information. Keyword match is weighted heavily because job-specific language matters. Skills match separates hard skills and soft skills where possible. Section completeness checks for recognizable resume sections. Readability looks at whether the resume has enough substance without becoming overloaded. Contact information checks for email, phone, and a professional link."
        },
        {
          heading: "How to improve your score",
          body: "Start with missing keywords that are both important and truthful. Add them to the summary, skills, work bullets, or project descriptions where they fit naturally. Next, fix missing sections by using standard headings like Summary, Skills, Work Experience, Education, and Projects. Then review length. If the resume is too short, add measurable accomplishments. If it is too long, tighten older roles and remove weaker details. Finally, make sure contact details are visible near the top and written as text."
        },
        {
          heading: "Free versus Pro analysis",
          body: "Free users can see the overall score, top missing keywords, and basic suggestions. That is enough to catch major gaps before applying. Pro users unlock the full keyword breakdown, missing hard skills, missing soft skills, section problems, detailed suggestions, and a downloadable ATS report. This creates a practical upgrade path for serious job seekers who need more precision. ResumePro keeps the scoring rule-based for transparency while using AI for writing tasks like summaries, bullets, skills, and cover letters."
        }
      ]}
    />
  );
}
