import Link from "next/link";
import { FileText } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { LinkButton } from "@/components/ui/Button";

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-950">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <FileText className="h-5 w-5" />
          </span>
          ResumePro
        </Link>
        <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link href="/resume-builder" className="hover:text-brand-600">
            Builder
          </Link>
          <Link href="/ats-checker" className="hover:text-brand-600">
            ATS Checker
          </Link>
          <Link href="/cover-letter-generator" className="hover:text-brand-600">
            Cover Letters
          </Link>
          <Link href="/pricing" className="hover:text-brand-600">
            Pricing
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <LinkButton href="/dashboard" variant="outline" size="sm">
              Dashboard
            </LinkButton>
          ) : (
            <>
              <Link href="/auth/signin" className="hidden text-sm font-semibold text-slate-700 sm:block">
                Sign in
              </Link>
              <LinkButton href="/auth/signup" size="sm">
                Build Free Resume
              </LinkButton>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
