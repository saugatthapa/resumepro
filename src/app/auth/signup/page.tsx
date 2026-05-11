import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { SignUpForm } from "./SignUpForm";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a free ResumePro account to build resumes, generate cover letters, and check ATS score."
};

export default async function SignUpPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <section className="bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">Create your free account</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Start with one resume, ATS checks, limited AI, and watermarked PDF export.
        </p>
        <div className="mt-8">
          <SignUpForm />
        </div>
      </div>
    </section>
  );
}
