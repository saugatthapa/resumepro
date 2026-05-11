import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to ResumePro to manage resumes, ATS checks, cover letters, and billing."
};

export default async function SignInPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <section className="bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">Welcome back</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Sign in with your email and password to continue building.
        </p>
        <div className="mt-8">
          <SignInForm />
        </div>
      </div>
    </section>
  );
}
