import { NextResponse } from "next/server";
import { z } from "zod";
import { generateGroqText } from "@/lib/ai";
import { getCurrentUser } from "@/lib/auth";
import { canUseFeature, getTodayUsage, incrementUsage } from "@/lib/usage";

const schema = z.object({
  bullet: z.string().min(1),
  jobTitle: z.string().optional().default("")
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Provide a resume bullet to improve." }, { status: 400 });
  }

  const usage = await getTodayUsage(user.id);
  const permission = canUseFeature({ plan: user.plan, usage, feature: "ai" });
  if (!permission.allowed) {
    return NextResponse.json({ error: permission.reason }, { status: 403 });
  }

  const { text, usedFallback } = await generateGroqText({
    system: "You rewrite resume bullets to be measurable, concise, and achievement-focused.",
    prompt: `Rewrite this resume bullet for a ${parsed.data.jobTitle || "target"} role. Make it action-oriented, measurable when possible, and ATS friendly: ${parsed.data.bullet}`,
    fallback: `Improved key outcomes by applying structured execution, cross-functional collaboration, and measurable process improvements.`
  });

  await incrementUsage(user.id, "aiGenerations");
  return NextResponse.json({ text, usedFallback });
}
