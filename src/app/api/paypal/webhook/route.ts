import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const event = await request.json().catch(() => null);

  // TODO: In production, verify subscription using PayPal API/webhook before activating Pro.
  // Verify the webhook signature, inspect the subscription event, and update User/Payment records accordingly.
  console.log("Received PayPal webhook placeholder", event?.event_type ?? "unknown");

  return NextResponse.json({ received: true });
}
