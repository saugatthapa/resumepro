"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Download, Save, Sparkles, Trash2 } from "lucide-react";
import { ResumePreview } from "@/components/ResumePreview";
import { TemplateCard } from "@/components/TemplateCard";
import { UpgradeModal } from "@/components/UpgradeModal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { emptyResumeData, listFromText, type ResumeData, type SavedResume } from "@/lib/resume";
import { defaultTemplateId, resumeTemplates } from "@/lib/templates";

type Status = {
  type: "idle" | "success" | "error";
  message: string;
};

function cloneResumeData(data: ResumeData): ResumeData {
  return JSON.parse(JSON.stringify(data)) as ResumeData;
}

export function ResumeBuilderClient({
  userPlan,
  initialResumes
}: {
  userPlan: "FREE" | "PRO";
  initialResumes: SavedResume[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const previewRef = useRef<HTMLElement | null>(null);
  const queryResumeId = searchParams.get("resumeId");
  const firstResume = initialResumes.find((resume) => resume.id === queryResumeId) ?? initialResumes[0];
  const [resumes, setResumes] = useState(initialResumes);
  const [currentId, setCurrentId] = useState(firstResume?.id ?? "");
  const [title, setTitle] = useState(firstResume?.title ?? "Untitled Resume");
  const [templateId, setTemplateId] = useState(firstResume?.templateId ?? defaultTemplateId);
  const [data, setData] = useState<ResumeData>(firstResume ? cloneResumeData(firstResume.data) : cloneResumeData(emptyResumeData));
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });
  const [loading, setLoading] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");

  const selectedResume = useMemo(
    () => resumes.find((resume) => resume.id === currentId),
    [resumes, currentId]
  );

  function updateData<K extends keyof ResumeData>(key: K, value: ResumeData[K]) {
    setData((current) => ({ ...current, [key]: value }));
  }

  function selectResume(resumeId: string) {
    const resume = resumes.find((item) => item.id === resumeId);
    if (!resume) {
      setCurrentId("");
      setTitle("Untitled Resume");
      setTemplateId(defaultTemplateId);
      setData(cloneResumeData(emptyResumeData));
      router.replace("/resume-builder");
      return;
    }
    setCurrentId(resume.id);
    setTitle(resume.title);
    setTemplateId(resume.templateId);
    setData(cloneResumeData(resume.data));
    router.replace(`/resume-builder?resumeId=${resume.id}`);
  }

  function handleTemplateSelect(nextTemplateId: string, locked: boolean) {
    if (locked) {
      setUpgradeMessage("Premium templates are included with ResumePro Pro.");
      setUpgradeOpen(true);
      return;
    }
    setTemplateId(nextTemplateId);
  }

  async function saveResume() {
    setLoading(true);
    setStatus({ type: "idle", message: "" });
    const payload = { title, templateId, data };
    const response = await fetch(currentId ? `/api/resumes/${currentId}` : "/api/resumes", {
      method: currentId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = (await response.json().catch(() => null)) as { resume?: SavedResume; error?: string } | null;
    setLoading(false);

    if (!response.ok || !result?.resume) {
      setStatus({ type: "error", message: result?.error || "Unable to save resume." });
      if (response.status === 403) {
        setUpgradeMessage(result?.error || "Upgrade to Pro to continue.");
        setUpgradeOpen(true);
      }
      return;
    }

    setCurrentId(result.resume.id);
    setResumes((current) => {
      const exists = current.some((resume) => resume.id === result.resume?.id);
      return exists
        ? current.map((resume) => (resume.id === result.resume?.id ? result.resume : resume))
        : [result.resume!, ...current];
    });
    setStatus({ type: "success", message: "Resume saved." });
    router.replace(`/resume-builder?resumeId=${result.resume.id}`);
    router.refresh();
  }

  async function deleteResume() {
    if (!currentId) {
      return;
    }
    setLoading(true);
    const response = await fetch(`/api/resumes/${currentId}`, { method: "DELETE" });
    setLoading(false);
    if (!response.ok) {
      setStatus({ type: "error", message: "Unable to delete resume." });
      return;
    }
    setResumes((current) => current.filter((resume) => resume.id !== currentId));
    setCurrentId("");
    setTitle("Untitled Resume");
    setTemplateId(defaultTemplateId);
    setData(cloneResumeData(emptyResumeData));
    setStatus({ type: "success", message: "Resume deleted." });
    router.replace("/resume-builder");
    router.refresh();
  }

  async function exportPdf() {
    if (!previewRef.current) {
      return;
    }
    if (userPlan !== "PRO") {
      setUpgradeMessage("Free exports include a ResumePro watermark. Upgrade to Pro for clean PDF export.");
      setUpgradeOpen(true);
    }
    const html2pdf = (await import("html2pdf.js")).default;
    await html2pdf()
      .set({
        margin: 0.2,
        filename: `${title || "resume"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
      })
      .from(previewRef.current)
      .save();
  }

  async function generateSummary() {
    setLoading(true);
    const response = await fetch("/api/ai/resume-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobTitle: data.jobTitle || "target role",
        skills: data.skills.join(", ") || "professional skills",
        experience: data.workExperience.map((item) => `${item.role} ${item.company} ${item.bullets.join(" ")}`).join("\n") || "professional experience"
      })
    });
    const result = (await response.json().catch(() => null)) as { text?: string; error?: string } | null;
    setLoading(false);
    if (!response.ok || !result?.text) {
      setStatus({ type: "error", message: result?.error || "Unable to generate summary." });
      if (response.status === 403) {
        setUpgradeMessage(result?.error || "Upgrade to Pro for more AI generations.");
        setUpgradeOpen(true);
      }
      return;
    }
    updateData("summary", result.text);
  }

  async function suggestSkills() {
    setLoading(true);
    const response = await fetch("/api/ai/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobTitle: data.jobTitle || "target role" })
    });
    const result = (await response.json().catch(() => null)) as { text?: string; error?: string } | null;
    setLoading(false);
    if (!response.ok || !result?.text) {
      setStatus({ type: "error", message: result?.error || "Unable to suggest skills." });
      if (response.status === 403) {
        setUpgradeMessage(result?.error || "Upgrade to Pro for more AI generations.");
        setUpgradeOpen(true);
      }
      return;
    }
    updateData("skills", listFromText(result.text));
  }

  const work = data.workExperience[0] ?? emptyResumeData.workExperience[0];
  const education = data.education[0] ?? emptyResumeData.education[0];
  const project = data.projects[0] ?? emptyResumeData.projects[0];

  return (
    <section className="bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Resume Builder</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Build and preview your resume</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={saveResume} disabled={loading}>
              <Save className="h-4 w-4" />
              {loading ? "Working..." : "Save resume"}
            </Button>
            <Button type="button" onClick={exportPdf}>
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {status.message ? (
          <p
            className={`mt-4 rounded-lg px-4 py-3 text-sm font-semibold ${
              status.type === "error" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {status.message}
          </p>
        ) : null}

        <div className="mt-8 grid gap-8 lg:grid-cols-[420px_1fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="savedResume">Saved resumes</Label>
                  <Select id="savedResume" value={currentId} onChange={(event) => selectResume(event.target.value)}>
                    <option value="">New resume</option>
                    {resumes.map((resume) => (
                      <option key={resume.id} value={resume.id}>
                        {resume.title}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Resume title</Label>
                  <Input id="title" value={title} onChange={(event) => setTitle(event.target.value)} />
                </div>
                {selectedResume ? (
                  <Button type="button" variant="danger" onClick={deleteResume} disabled={loading}>
                    <Trash2 className="h-4 w-4" />
                    Delete resume
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">Templates</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {resumeTemplates.map((template) => {
                  const locked = template.tier === "pro" && userPlan !== "PRO";
                  return (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      selected={templateId === template.id}
                      locked={locked}
                      onSelect={() => handleTemplateSelect(template.id, locked)}
                    />
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">Resume details</h2>
              <div className="mt-4 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Full name</Label>
                    <Input value={data.fullName} onChange={(event) => updateData("fullName", event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Job title</Label>
                    <Input value={data.jobTitle} onChange={(event) => updateData("jobTitle", event.target.value)} />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={data.email} onChange={(event) => updateData("email", event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={data.phone} onChange={(event) => updateData("phone", event.target.value)} />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input value={data.location} onChange={(event) => updateData("location", event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>LinkedIn or website</Label>
                    <Input value={data.website} onChange={(event) => updateData("website", event.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label>Professional summary</Label>
                    <Button type="button" size="sm" variant="outline" onClick={generateSummary} disabled={loading}>
                      <Sparkles className="h-4 w-4" />
                      AI summary
                    </Button>
                  </div>
                  <Textarea value={data.summary} onChange={(event) => updateData("summary", event.target.value)} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label>Skills</Label>
                    <Button type="button" size="sm" variant="outline" onClick={suggestSkills} disabled={loading}>
                      <Sparkles className="h-4 w-4" />
                      Suggest skills
                    </Button>
                  </div>
                  <Textarea
                    value={data.skills.join(", ")}
                    onChange={(event) => updateData("skills", listFromText(event.target.value))}
                    placeholder="React, TypeScript, Leadership"
                  />
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <h3 className="font-bold text-slate-950">Work experience</h3>
                  <div className="mt-4 grid gap-4">
                    <Input
                      placeholder="Company"
                      value={work.company}
                      onChange={(event) =>
                        updateData("workExperience", [{ ...work, company: event.target.value }])
                      }
                    />
                    <Input
                      placeholder="Role"
                      value={work.role}
                      onChange={(event) => updateData("workExperience", [{ ...work, role: event.target.value }])}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        placeholder="Start date"
                        value={work.startDate}
                        onChange={(event) =>
                          updateData("workExperience", [{ ...work, startDate: event.target.value }])
                        }
                      />
                      <Input
                        placeholder="End date"
                        value={work.endDate}
                        onChange={(event) =>
                          updateData("workExperience", [{ ...work, endDate: event.target.value }])
                        }
                      />
                    </div>
                    <Textarea
                      placeholder="One bullet per line"
                      value={work.bullets.join("\n")}
                      onChange={(event) =>
                        updateData("workExperience", [{ ...work, bullets: listFromText(event.target.value) }])
                      }
                    />
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <h3 className="font-bold text-slate-950">Education</h3>
                  <div className="mt-4 grid gap-4">
                    <Input
                      placeholder="School"
                      value={education.school}
                      onChange={(event) => updateData("education", [{ ...education, school: event.target.value }])}
                    />
                    <Input
                      placeholder="Degree"
                      value={education.degree}
                      onChange={(event) => updateData("education", [{ ...education, degree: event.target.value }])}
                    />
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <h3 className="font-bold text-slate-950">Projects and certifications</h3>
                  <div className="mt-4 grid gap-4">
                    <Input
                      placeholder="Project name"
                      value={project.name}
                      onChange={(event) => updateData("projects", [{ ...project, name: event.target.value }])}
                    />
                    <Textarea
                      placeholder="Project description"
                      value={project.description}
                      onChange={(event) => updateData("projects", [{ ...project, description: event.target.value }])}
                    />
                    <Textarea
                      placeholder="Certifications, separated by commas or lines"
                      value={data.certifications.join(", ")}
                      onChange={(event) => updateData("certifications", listFromText(event.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <ResumePreview
              ref={previewRef}
              data={data}
              templateId={templateId}
              watermark={userPlan !== "PRO"}
            />
          </div>
        </div>
      </div>
      <UpgradeModal
        open={upgradeOpen}
        message={upgradeMessage}
        onClose={() => setUpgradeOpen(false)}
      />
    </section>
  );
}
