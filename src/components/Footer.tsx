import Link from "next/link";

const links = [
  ["Resume Summary Generator", "/resume-summary-generator"],
  ["Skills Generator", "/skills-for-resume-generator"],
  ["Resume Headline Generator", "/resume-headline-generator"],
  ["Free Cover Letter Generator", "/cover-letter-generator-free"],
  ["ATS Resume Checker", "/ats-resume-checker"]
];

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_1fr] lg:px-8">
        <div>
          <p className="text-lg font-bold">ResumePro</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
            AI resume building, rule-based ATS scoring, cover letters, and premium templates in one deployable SaaS app.
          </p>
        </div>
        <div className="grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-white">
              {label}
            </Link>
          ))}
          <Link href="/pricing" className="hover:text-white">
            Pricing
          </Link>
          <Link href="/dashboard" className="hover:text-white">
            Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}
