import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { getPayPalAmount } from "@/lib/paypal";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  subscriptionId: z.string().min(3),
  billingPeriod: z.enum(["monthly", "yearly"])
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Missing PayPal subscription details." }, { status: 400 });
  }

  // TODO: In production, verify subscription using PayPal API/webhook before activating Pro.
  // The MVP trusts the PayPal JS SDK approval callback so the subscription flow can be tested end to end.
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        plan: "PRO",
        paypalSubscriptionId: parsed.data.subscriptionId,
        paypalSubscriptionStatus: "APPROVED"
      }
    }),
    prisma.payment.create({
      data: {
        userId: user.id,
        provider: "paypal",
        subscriptionId: parsed.data.subscriptionId,
        status: "APPROVED",
        plan: `PRO_${parsed.data.billingPeriod.toUpperCase()}`,
        amount: getPayPalAmount(parsed.data.billingPeriod),
        currency: "USD"
      }
    })
  ]);

  return NextResponse.json({ ok: true, plan: "PRO" });
}
