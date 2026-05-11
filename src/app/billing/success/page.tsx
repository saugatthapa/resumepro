import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Billing Success",
  description: "Your ResumePro Pro subscription was activated."
};

export default function BillingSuccessPage() {
  return (
    <section className="bg-slate-50 px-4 py-20">
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-soft">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
        <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950">Payment successful</h1>
        <p className="mt-3 text-slate-600">
          Your Pro plan should now be active. Refresh your dashboard to see updated access.
        </p>
        <div className="mt-7">
          <LinkButton href="/dashboard">Go to dashboard</LinkButton>
        </div>
      </div>
    </section>
  );
}
