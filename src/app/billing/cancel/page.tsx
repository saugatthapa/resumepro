import type { Metadata } from "next";
import { XCircle } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Billing Canceled",
  description: "Your PayPal checkout was canceled."
};

export default function BillingCancelPage() {
  return (
    <section className="bg-slate-50 px-4 py-20">
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-soft">
        <XCircle className="mx-auto h-14 w-14 text-amber-600" />
        <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950">Payment canceled</h1>
        <p className="mt-3 text-slate-600">
          No changes were made to your plan. You can keep using Free or return to pricing when ready.
        </p>
        <div className="mt-7">
          <LinkButton href="/pricing" variant="outline">Back to pricing</LinkButton>
        </div>
      </div>
    </section>
  );
}
