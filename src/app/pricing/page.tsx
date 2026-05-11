import type { Metadata } from "next";
import { PricingClient } from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing",
  description: "ResumePro pricing: Free, Pro Monthly at $4.99/month, and Pro Yearly at $29/year with PayPal subscriptions."
};

export default function PricingPage() {
  return (
    <PricingClient
      clientId={process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ""}
      monthlyPlanId={process.env.PAYPAL_PRO_MONTHLY_PLAN_ID || ""}
      yearlyPlanId={process.env.PAYPAL_PRO_YEARLY_PLAN_ID || ""}
    />
  );
}
