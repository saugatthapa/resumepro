import type { Metadata } from "next";
import { SEOContentPage } from "@/components/SEOContentPage";

export const metadata: Metadata = {
  title: "Skills for Resume Generator",
  description:
    "Find relevant hard skills and soft skills for your resume, then tailor them to job descriptions with ResumePro."
};

export default function SkillsForResumeGeneratorPage() {
  return (
    <SEOContentPage
      title="Skills for Resume Generator"
      intro="The skills section is one of the most scanned areas of a resume. ResumePro helps you choose skills that match your target role, support your experience, and improve ATS alignment without turning your resume into a keyword dump."
      ctaHref="/resume-builder"
      ctaLabel="Generate resume skills"
      sections={[
        {
          heading: "Why resume skills matter",
          body: "Recruiters use skills to understand fit quickly, and ATS tools often use skills to rank or filter candidates. A clear skills section can help your resume pass the first scan, but only when the skills are relevant to the job. Listing every tool you have touched can dilute your positioning. A better approach is to group the strongest technical skills, tools, methods, and interpersonal strengths that connect to the role. For example, a product manager might include roadmap planning, analytics, stakeholder management, discovery, experimentation, and go-to-market coordination."
        },
        {
          heading: "Hard skills versus soft skills",
          body: "Hard skills are teachable, role-specific capabilities such as SQL, React, financial modeling, Salesforce, Excel, Figma, search engine optimization, or project management. Soft skills describe how you work, such as communication, leadership, collaboration, prioritization, and problem solving. Both matter, but they should be handled differently. Hard skills belong in the skills section and in experience bullets. Soft skills are strongest when supported by evidence. Instead of only listing leadership, describe leading a migration, coordinating a launch, or mentoring a team through a measurable result."
        },
        {
          heading: "How to choose the right skills",
          body: "Start with the job description. Highlight repeated tools, responsibilities, and qualifications. Then compare that list to your actual experience. Skills that appear in both places should usually be prioritized. Next, add skills that strengthen your story even if they are not repeated in the posting. If a job asks for a marketing analyst, the description might mention dashboards, campaigns, reporting, and audience segmentation. Your resume could include SQL, Looker, Excel, lifecycle marketing, A/B testing, and data storytelling if those skills are honest and relevant."
        },
        {
          heading: "Where skills should appear",
          body: "A skills section is helpful, but it should not be the only place skills appear. Important skills should also show up in work experience bullets, projects, certifications, and summary text. This gives the reader proof that you used the skill in context. A resume that lists Python but never describes a Python project may feel weaker than a resume that names Python in a bullet about automating reporting or building an internal tool. ResumePro helps you keep the skills visible in the preview while checking whether the job description language is represented."
        },
        {
          heading: "How ResumePro helps",
          body: "ResumePro can suggest relevant skills for a target job title using Groq-powered AI. After adding those skills to your resume, you can run the ATS checker to compare your resume against a specific job description. Free users get useful basic guidance, while Pro users see more detailed skill gaps, missing hard skills, missing soft skills, and advanced suggestions. This lets you build a skills section that is concise, truthful, and strategically aligned with the jobs you want."
        }
      ]}
    />
  );
}
