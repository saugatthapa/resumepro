export type PayPalPlanKey = "monthly" | "yearly";

export function getPayPalPlanId(plan: PayPalPlanKey) {
  return plan === "monthly"
    ? process.env.PAYPAL_PRO_MONTHLY_PLAN_ID
    : process.env.PAYPAL_PRO_YEARLY_PLAN_ID;
}

export function getPayPalAmount(plan: PayPalPlanKey) {
  return plan === "monthly" ? 499 : 2900;
}
