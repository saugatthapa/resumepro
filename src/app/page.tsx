import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Brain, CheckCircle2, FileText, Search, Sparkles } from "lucide-react";
import { PricingCard } from "@/components/PricingCard";
import { LinkButton } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Create a job-winning resume in minutes",
  description:
    "Build ATS-friendly resumes with AI, professional templates, resume scoring, and cover letters in ResumePro."
};

const features = [
  {
    title: "AI Resume Builder",
    description:
      "Turn your role, experience, and skills into polished summaries, bullets, and resume sections tuned for hiring teams.",
    icon: Brain
  },
  {
    title: "ATS Resume Checker",
    description:
      "Compare your resume to a job description and see keyword gaps, section issues, readability signals, and contact checks.",
    icon: Search
  },
  {
    title: "Cover Letter Generator",
    description:
      "Create concise, personalized cover letters in professional, friendly, or confident tones using Groq-powered AI.",
    icon: FileText
  },
  {
    title: "Premium Templates",
    description:
      "Start free with clean templates, then unlock executive, technical, creative, and corporate layouts with Pro.",
    icon: Sparkles
  }
];

const faqs = [
  [
    "Can I create a resume for free?",
    "Yes. Free users can create one resume, use two templates, run basic ATS checks, generate limited AI content, and export a watermarked PDF."
  ],
  [
    "Does ResumePro use Stripe or Paddle?",
    "No. This MVP uses PayPal subscriptions only, with monthly and yearly Pro options."
  ],
  [
    "How does the ATS score work?",
    "The score is rule-based and compares keywords, hard and soft skills, sections, readability, length, and contact information."
  ],
  [
    "What changes with Pro?",
    "Pro unlocks unlimited resumes, premium templates, no-watermark PDF export, advanced ATS analysis, and expanded AI generation."
  ]
];

export default function HomePage() {
  return (
    <>
      <section className="overflow-hidden bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-24">
          <div>
            <p className="inline-flex rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
              ATS-ready resumes, AI writing, and clean templates
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
              Create a job-winning resume in minutes
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              ResumePro helps you build professional resumes that pass ATS filters, sharpen your
              positioning with Groq-powered AI, and export polished templates that hiring teams can scan fast.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/resume-builder" size="lg">
                Build Free Resume <ArrowRight className="h-5 w-5" />
              </LinkButton>
              <LinkButton href="/ats-checker" size="lg" variant="outline">
                Check ATS Score
              </LinkButton>
            </div>
            <div className="mt-8 grid gap-3 text-sm font-medium text-slate-600 sm:grid-cols-3">
              {["No Stripe or Paddle", "PayPal Pro upgrades", "Vercel-ready stack"].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <div className="rounded-xl bg-slate-950 p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-300">ATS Score</p>
                    <p className="mt-1 text-5xl font-black text-emerald-400">86</p>
                  </div>
                  <div className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold">Pro preview</div>
                </div>
                <div className="mt-6 space-y-3">
                  {["Keyword match", "Skills alignment", "Section clarity", "Contact parsing"].map((label, index) => (
                    <div key={label}>
                      <div className="mb-1 flex justify-between text-xs text-slate-300">
                        <span>{label}</span>
                        <span>{92 - index * 7}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10">
                        <div className="h-2 rounded-full bg-emerald-400" style={{ width: `${92 - index * 7}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 rounded-xl border border-slate-200 p-5">
                <div className="h-3 w-36 rounded-full bg-brand-600" />
                <div className="mt-5 h-4 w-56 rounded-full bg-slate-300" />
                <div className="mt-3 h-3 w-40 rounded-full bg-slate-200" />
                <div className="mt-6 grid gap-3">
                  <div className="h-3 rounded-full bg-slate-200" />
                  <div className="h-3 rounded-full bg-slate-200" />
                  <div className="h-3 w-2/3 rounded-full bg-slate-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-black tracking-tight text-slate-950">Everything you need to apply faster</h2>
            <p className="mt-3 text-slate-600">
              Build, score, improve, and export from one focused workspace.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <feature.icon className="h-7 w-7 text-brand-600" />
                <h3 className="mt-5 text-lg font-bold text-slate-950">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-950">Simple pricing</h2>
              <p className="mt-3 text-slate-600">Start free, upgrade when clean exports and premium insights matter.</p>
            </div>
            <Link href="/pricing" className="font-semibold text-brand-600 hover:text-brand-700">
              View full pricing
            </Link>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <PricingCard
              name="Free"
              price="$0"
              description="For getting a polished resume started."
              features={["1 resume", "2 free templates", "Watermarked PDF export", "Basic ATS score", "Limited AI"]}
            />
            <PricingCard
              name="Pro Monthly"
              price="$4.99/mo"
              description="For active job searches that need fast iteration."
              highlighted
              features={["Unlimited resumes", "6 templates", "No watermark", "Advanced ATS", "More AI generations"]}
              href="/pricing"
              cta="Upgrade with PayPal"
            />
            <PricingCard
              name="Pro Yearly"
              price="$29/yr"
              description="Best value for ongoing career growth."
              features={["All Pro features", "Unlimited cover letters", "Resume optimization", "Premium templates", "PDF export"]}
              href="/pricing"
              cta="Save with yearly"
            />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight text-slate-950">FAQ</h2>
          <div className="mt-8 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {faqs.map(([question, answer]) => (
              <div key={question} className="p-6">
                <h3 className="font-bold text-slate-950">{question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
