export type ATSResult = {
  totalScore: number;
  keywordScore: number;
  skillsScore: number;
  sectionScore: number;
  readabilityScore: number;
  contactScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  missingHardSkills: string[];
  missingSoftSkills: string[];
  sectionProblems: string[];
  suggestions: string[];
};

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "has",
  "have",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "our",
  "that",
  "the",
  "to",
  "with",
  "you",
  "your",
  "will"
]);

const hardSkills = [
  "javascript",
  "typescript",
  "react",
  "next.js",
  "node",
  "python",
  "sql",
  "postgres",
  "aws",
  "azure",
  "docker",
  "kubernetes",
  "excel",
  "tableau",
  "salesforce",
  "figma",
  "seo",
  "analytics",
  "prisma"
];

const softSkills = [
  "communication",
  "leadership",
  "collaboration",
  "problem solving",
  "ownership",
  "adaptability",
  "stakeholder",
  "mentoring",
  "prioritization"
];

export function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractKeywords(text: string) {
  const normalized = normalizeText(text);
  const words = normalized
    .split(/\s+/)
    .map((word) => word.replace(/^[.-]+|[.-]+$/g, ""))
    .filter((word) => word.length > 2 && !stopWords.has(word));

  const counts = new Map<string, number>();
  for (const word of words) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  const phrases = [...normalized.matchAll(/\b[a-z0-9+#.]+(?:\s+[a-z0-9+#.]+){1,2}\b/g)]
    .map(([phrase]) => phrase)
    .filter((phrase) => !phrase.split(" ").every((word) => stopWords.has(word)));

  for (const phrase of phrases) {
    if (hardSkills.includes(phrase) || softSkills.includes(phrase)) {
      counts.set(phrase, (counts.get(phrase) ?? 0) + 2);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 35)
    .map(([keyword]) => keyword);
}

export function detectSections(text: string) {
  const normalized = normalizeText(text);
  return {
    summary: /\b(summary|profile|objective)\b/.test(normalized),
    experience: /\b(experience|employment|work history)\b/.test(normalized),
    education: /\b(education|degree|university|college)\b/.test(normalized),
    skills: /\b(skills|technologies|tools)\b/.test(normalized),
    projects: /\b(projects|portfolio)\b/.test(normalized)
  };
}

export function detectContact(text: string) {
  return {
    email: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text),
    phone: /(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}/.test(text),
    link: /(linkedin\.com|github\.com|https?:\/\/|www\.)/i.test(text)
  };
}

function scoreRatio(matches: number, total: number, weight: number) {
  if (total === 0) {
    return weight;
  }
  return Math.round(Math.min(matches / total, 1) * weight);
}

export function calculateATSScore(resumeText: string, jobDescription: string): ATSResult {
  const resume = normalizeText(resumeText);
  const job = normalizeText(jobDescription);
  const jobKeywords = extractKeywords(job);
  const matchedKeywords = jobKeywords.filter((keyword) => resume.includes(keyword));
  const missingKeywords = jobKeywords.filter((keyword) => !resume.includes(keyword));

  const desiredHardSkills = hardSkills.filter((skill) => job.includes(skill));
  const desiredSoftSkills = softSkills.filter((skill) => job.includes(skill));
  const missingHardSkills = desiredHardSkills.filter((skill) => !resume.includes(skill));
  const missingSoftSkills = desiredSoftSkills.filter((skill) => !resume.includes(skill));
  const skillMatches =
    desiredHardSkills.length +
    desiredSoftSkills.length -
    missingHardSkills.length -
    missingSoftSkills.length;
  const skillTotal = desiredHardSkills.length + desiredSoftSkills.length;

  const sections = detectSections(resumeText);
  const requiredSections = ["summary", "experience", "education", "skills"] as const;
  const presentSections = requiredSections.filter((section) => sections[section]).length;
  const sectionProblems = requiredSections
    .filter((section) => !sections[section])
    .map((section) => `Add a clear ${section} section heading.`);

  const wordCount = resume.split(/\s+/).filter(Boolean).length;
  const readableLength = wordCount >= 300 && wordCount <= 900;
  const readabilityScore = readableLength ? 10 : wordCount < 300 ? 5 : 7;

  const contact = detectContact(resumeText);
  const contactScore = Math.round(
    ([contact.email, contact.phone, contact.link].filter(Boolean).length / 3) * 10
  );

  const keywordScore = scoreRatio(matchedKeywords.length, jobKeywords.length, 35);
  const skillsScore = scoreRatio(skillMatches, skillTotal, 25);
  const sectionScore = scoreRatio(presentSections, requiredSections.length, 20);

  const suggestions = [
    missingKeywords.length > 0
      ? `Add role-specific keywords such as ${missingKeywords.slice(0, 6).join(", ")}.`
      : "Your resume already mirrors the most important job keywords.",
    missingHardSkills.length > 0
      ? `Highlight hard skills: ${missingHardSkills.slice(0, 5).join(", ")}.`
      : "Hard skills alignment looks strong.",
    sectionProblems.length > 0
      ? "Use standard section headings so ATS parsers can classify your content."
      : "Core resume sections are easy to identify.",
    wordCount < 300
      ? "Add more measurable accomplishments to reach a stronger resume length."
      : "Keep bullet points concise and achievement-focused.",
    contactScore < 10 ? "Include email, phone, and a professional link near the top." : "Contact details are ATS friendly."
  ];

  return {
    totalScore: Math.min(
      100,
      keywordScore + skillsScore + sectionScore + readabilityScore + contactScore
    ),
    keywordScore,
    skillsScore,
    sectionScore,
    readabilityScore,
    contactScore,
    matchedKeywords,
    missingKeywords,
    missingHardSkills,
    missingSoftSkills,
    sectionProblems,
    suggestions
  };
}
