"use client";

import { useState } from "react";
import { Copy, FileText, Sparkles } from "lucide-react";
import { UpgradeModal } from "@/components/UpgradeModal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";

export function CoverLetterClient({
  userName,
  userPlan
}: {
  userName: string;
  userPlan: "FREE" | "PRO";
}) {
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [skills, setSkills] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState<"professional" | "friendly" | "confident">("professional");
  const [letter, setLetter] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  async function generateLetter() {
    setLoading(true);
    setError("");
    const response = await fetch("/api/ai/cover-letter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobTitle, companyName, skills, jobDescription, tone })
    });
    const result = (await response.json().catch(() => null)) as { text?: string; error?: string } | null;
    setLoading(false);

    if (!response.ok || !result?.text) {
      setError(result?.error || "Unable to generate cover letter.");
      if (response.status === 403) {
        setUpgradeOpen(true);
      }
      return;
    }

    setLetter(result.text);
  }

  async function copyLetter() {
    if (letter) {
      await navigator.clipboard.writeText(letter);
    }
  }

  return (
    <section className="bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Cover Letter Generator</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
            Generate a tailored cover letter
          </h1>
          <p className="mt-3 text-slate-600">
            Free users can generate one cover letter per day. Pro users unlock unlimited cover letters and more AI.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[420px_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="space-y-2">
                  <Label>Job title</Label>
                  <Input value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Company name</Label>
                  <Input value={companyName} onChange={(event) => setCompanyName(event.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>User skills</Label>
                <Textarea
                  value={skills}
                  onChange={(event) => setSkills(event.target.value)}
                  placeholder="React, customer onboarding, SQL, project leadership..."
                />
              </div>
              <div className="space-y-2">
                <Label>Job description</Label>
                <Textarea
                  className="min-h-56"
                  value={jobDescription}
                  onChange={(event) => setJobDescription(event.target.value)}
                  placeholder="Paste the job description here..."
                />
              </div>
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onChange={(event) => setTone(event.target.value as typeof tone)}>
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="confident">Confident</option>
                </Select>
              </div>
              {error ? <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{error}</p> : null}
              <Button type="button" className="w-full" onClick={generateLetter} disabled={loading}>
                <Sparkles className="h-4 w-4" />
                {loading ? "Generating..." : "Generate Cover Letter"}
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-950">Generated letter</h2>
                <p className="mt-1 text-sm text-slate-600">Review and personalize before sending.</p>
              </div>
              <Button type="button" variant="outline" onClick={copyLetter} disabled={!letter}>
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>
            <div className="mt-6 min-h-[520px] whitespace-pre-wrap rounded-xl bg-slate-50 p-6 text-sm leading-7 text-slate-800">
              {letter || (
                <div className="flex h-[460px] items-center justify-center text-center text-slate-500">
                  <div>
                    <FileText className="mx-auto h-10 w-10 text-brand-600" />
                    <p className="mt-4 font-semibold text-slate-700">Your cover letter will appear here.</p>
                    <p className="mt-2">Signed as {userName}. Current plan: {userPlan}.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <UpgradeModal
        open={upgradeOpen}
        title="Unlock unlimited cover letters"
        message="Pro removes the daily cover letter cap and gives you more AI generations for every application."
        onClose={() => setUpgradeOpen(false)}
      />
    </section>
  );
}
