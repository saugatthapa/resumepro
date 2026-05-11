import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getTodayUsage } from "@/lib/usage";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const usage = await getTodayUsage(user.id);
  return NextResponse.json({ usage });
}
