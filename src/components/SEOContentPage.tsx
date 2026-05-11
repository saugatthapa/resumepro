import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

export function SEOContentPage({
  title,
  intro,
  sections,
  ctaHref,
  ctaLabel
}: {
  title: string;
  intro: string;
  sections: Array<{ heading: string; body: string }>;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <article className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-brand-100 bg-brand-50 p-6">
          <h1 className="text-4xl font-black tracking-tight text-slate-950">{title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-700">{intro}</p>
          <div className="mt-6">
            <LinkButton href={ctaHref} size="lg">
              {ctaLabel} <ArrowRight className="h-5 w-5" />
            </LinkButton>
          </div>
        </div>
        <div className="prose prose-slate mt-10 max-w-none">
          {sections.map((section) => (
            <section key={section.heading} className="mt-9">
              <h2 className="text-2xl font-black tracking-tight text-slate-950">{section.heading}</h2>
              <p className="mt-3 text-base leading-8 text-slate-700">{section.body}</p>
            </section>
          ))}
        </div>
        <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-bold text-slate-950">Related ResumePro tools</h2>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
            <Link href="/resume-builder" className="text-brand-600 hover:text-brand-700">
              Resume builder
            </Link>
            <Link href="/ats-checker" className="text-brand-600 hover:text-brand-700">
              ATS checker
            </Link>
            <Link href="/cover-letter-generator" className="text-brand-600 hover:text-brand-700">
              Cover letter generator
            </Link>
            <Link href="/pricing" className="text-brand-600 hover:text-brand-700">
              Pro templates
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
