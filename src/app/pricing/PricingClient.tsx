"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { PricingCard } from "@/components/PricingCard";
import { LinkButton } from "@/components/ui/Button";

function PayPalSubscriptionButton({
  planId,
  billingPeriod
}: {
  planId: string;
  billingPeriod: "monthly" | "yearly";
}) {
  const router = useRouter();
  const [error, setError] = useState("");

  if (!planId) {
    return (
      <div className="rounded-lg bg-amber-50 p-3 text-sm font-semibold text-amber-800">
        Add the PayPal {billingPeriod} plan ID to your environment to enable this button.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error ? <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{error}</p> : null}
      <PayPalButtons
        style={{ shape: "rect", layout: "vertical", label: "subscribe" }}
        createSubscription={(_data, actions) => {
          return actions.subscription!.create({
            plan_id: planId
          });
        }}
        onApprove={async (data) => {
          const subscriptionId = data.subscriptionID;
          if (!subscriptionId) {
            setError("PayPal did not return a subscription ID.");
            return;
          }
          const response = await fetch("/api/paypal/activate-pro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subscriptionId, billingPeriod })
          });
          if (response.status === 401) {
            router.push("/auth/signin?callbackUrl=/pricing");
            return;
          }
          if (!response.ok) {
            setError("Payment approved, but ResumePro could not activate Pro. Contact support.");
            return;
          }
          router.push("/billing/success");
          router.refresh();
        }}
        onCancel={() => router.push("/billing/cancel")}
        onError={() => setError("PayPal could not complete this subscription. Please try again.")}
      />
    </div>
  );
}

export function PricingClient({
  clientId,
  monthlyPlanId,
  yearlyPlanId
}: {
  clientId: string;
  monthlyPlanId: string;
  yearlyPlanId: string;
}) {
  const paypalReady = Boolean(clientId);

  return (
    <section className="bg-slate-50 px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Pricing</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Start free. Upgrade when you are ready to apply harder.
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            ResumePro uses PayPal subscriptions for MVP payments. No Stripe. No Paddle.
          </p>
        </div>

        {!paypalReady ? (
          <div className="mx-auto mt-8 flex max-w-3xl gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            <AlertCircle className="mt-1 h-5 w-5 shrink-0" />
            <p>
              PayPal buttons are hidden until `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is set. Add the client ID and plan IDs in Vercel
              or your local `.env` file to test subscriptions.
            </p>
          </div>
        ) : null}

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <PricingCard
            name="Free"
            price="$0"
            description="Create a resume and use the core tools with sensible free limits."
            features={[
              "1 resume",
              "2 free templates",
              "PDF export with watermark",
              "3 AI generations per day",
              "Basic ATS score",
              "1 cover letter per day"
            ]}
          >
            <LinkButton href="/auth/signup" variant="outline" className="w-full">
              Start free
            </LinkButton>
          </PricingCard>

          <PricingCard
            name="Pro Monthly"
            price="$4.99/mo"
            description="Best for focused application sprints and interview seasons."
            highlighted
            features={[
              "Unlimited resumes",
              "6 resume templates",
              "PDF export without watermark",
              "Advanced ATS analysis",
              "More AI generations",
              "Unlimited cover letters",
              "Resume optimization suggestions"
            ]}
          >
            {paypalReady ? (
              <PayPalScriptProvider
                options={{
                  clientId,
                  vault: true,
                  intent: "subscription"
                }}
              >
                <PayPalSubscriptionButton planId={monthlyPlanId} billingPeriod="monthly" />
              </PayPalScriptProvider>
            ) : (
              <div className="rounded-lg bg-slate-100 p-3 text-sm font-semibold text-slate-600">PayPal setup required</div>
            )}
          </PricingCard>

          <PricingCard
            name="Pro Yearly"
            price="$29/yr"
            description="A lower annual price for ongoing career moves."
            features={[
              "Everything in Pro Monthly",
              "Premium templates",
              "No watermark",
              "Advanced ATS analysis",
              "Unlimited cover letters",
              "Resume optimization suggestions"
            ]}
          >
            {paypalReady ? (
              <PayPalScriptProvider
                options={{
                  clientId,
                  vault: true,
                  intent: "subscription"
                }}
              >
                <PayPalSubscriptionButton planId={yearlyPlanId} billingPeriod="yearly" />
              </PayPalScriptProvider>
            ) : (
              <div className="rounded-lg bg-slate-100 p-3 text-sm font-semibold text-slate-600">PayPal setup required</div>
            )}
          </PricingCard>
        </div>

        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 text-sm leading-6 text-slate-600">
          <p className="font-bold text-slate-950">Production verification note</p>
          <p className="mt-2">
            This MVP stores the PayPal subscription ID after SDK approval and activates Pro for testing. Before production
            launch, verify subscription status with the PayPal API and signed webhooks before unlocking Pro access.
          </p>
        </div>
      </div>
    </section>
  );
}
