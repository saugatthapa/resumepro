"use client";

import { useState } from "react";
import { Download, Search, Sparkles } from "lucide-react";
import { ATSScoreCard } from "@/components/ATSScoreCard";
import { UpgradeModal } from "@/components/UpgradeModal";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type { ATSResult } from "@/lib/ats";

type SavedResumeText = {
  id: string;
  title: string;
  text: string;
};

export function ATSCheckerClient({
  userPlan,
  savedResumes
}: {
  userPlan: "FREE" | "PRO";
  savedResumes: SavedResumeText[];
}) {
  const [resumeText, setResumeText] = useState(savedResumes[0]?.text ?? "");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<ATSResult | null>(null);
  const [advanced, setAdvanced] = useState(userPlan === "PRO");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  async function runCheck() {
    setLoading(true);
    setError("");
    const response = await fetch("/api/ats/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText, jobDescription })
    });
    const data = (await response.json().catch(() => null)) as
      | { result?: ATSResult; advanced?: boolean; error?: string }
      | null;
    setLoading(false);

    if (!response.ok || !data?.result) {
      setError(data?.error || "Unable to calculate ATS score.");
      if (response.status === 403) {
        setUpgradeOpen(true);
      }
      return;
    }

    setResult(data.result);
    setAdvanced(Boolean(data.advanced));
    if (!data.advanced) {
      setUpgradeOpen(true);
    }
  }

  function downloadReport() {
    if (!result || !advanced) {
      setUpgradeOpen(true);
      return;
    }
    const report = [
      "ResumePro ATS Report",
      `Total score: ${result.totalScore}/100`,
      `Keyword score: ${result.keywordScore}/35`,
      `Skills score: ${result.skillsScore}/25`,
      `Section score: ${result.sectionScore}/20`,
      `Readability score: ${result.readabilityScore}/10`,
      `Contact score: ${result.contactScore}/10`,
      "",
      `Matched keywords: ${result.matchedKeywords.join(", ")}`,
      `Missing keywords: ${result.missingKeywords.join(", ")}`,
      `Missing hard skills: ${result.missingHardSkills.join(", ") || "None"}`,
      `Missing soft skills: ${result.missingSoftSkills.join(", ") || "None"}`,
      "",
      "Suggestions:",
      ...result.suggestions.map((suggestion) => `- ${suggestion}`)
    ].join("\n");
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "resumepro-ats-report.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">ATS Resume Checker</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Score your resume for a specific job</h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Paste resume text or choose a saved resume, add a job description, and see a transparent score out of 100.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={downloadReport}>
            <Download className="h-4 w-4" />
            Download ATS report
          </Button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label>Saved resume</Label>
                <Select
                  onChange={(event) => {
                    const resume = savedResumes.find((item) => item.id === event.target.value);
                    setResumeText(resume?.text ?? resumeText);
                  }}
                  defaultValue={savedResumes[0]?.id ?? ""}
                >
                  <option value="">Paste manually</option>
                  {savedResumes.map((resume) => (
                    <option key={resume.id} value={resume.id}>
                      {resume.title}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Resume text</Label>
                <Textarea
                  className="min-h-64"
                  value={resumeText}
                  onChange={(event) => setResumeText(event.target.value)}
                  placeholder="Paste resume text here..."
                />
              </div>
              <div className="space-y-2">
                <Label>Job description</Label>
                <Textarea
                  className="min-h-64"
                  value={jobDescription}
                  onChange={(event) => setJobDescription(event.target.value)}
                  placeholder="Paste job description here..."
                />
              </div>
              {error ? <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{error}</p> : null}
              <Button type="button" onClick={runCheck} disabled={loading} className="w-full">
                <Search className="h-4 w-4" />
                {loading ? "Scoring..." : "Calculate ATS score"}
              </Button>
            </div>
          </div>

          <div className="space-y-5">
            {result ? (
              <ATSScoreCard result={result} advanced={advanced} />
            ) : (
              <div className="flex min-h-[520px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <div>
                  <Sparkles className="mx-auto h-10 w-10 text-brand-600" />
                  <h2 className="mt-4 text-xl font-bold text-slate-950">Your ATS report will appear here</h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                    Free users see the score, top missing keywords, and basic suggestions. Pro users unlock the full breakdown.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <UpgradeModal
        open={upgradeOpen}
        title="Unlock advanced ATS analysis"
        message="Pro includes full keyword breakdowns, hard and soft skill gaps, section problems, detailed suggestions, and downloadable reports."
        onClose={() => setUpgradeOpen(false)}
      />
    </section>
  );
}
