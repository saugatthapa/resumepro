import { NextResponse } from "next/server";
import { z } from "zod";
import { generateGroqText } from "@/lib/ai";
import { getCurrentUser } from "@/lib/auth";
import { canUseFeature, getTodayUsage, incrementUsage } from "@/lib/usage";

const schema = z.object({
  jobTitle: z.string().min(1)
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Provide a target job title." }, { status: 400 });
  }

  const usage = await getTodayUsage(user.id);
  const permission = canUseFeature({ plan: user.plan, usage, feature: "ai" });
  if (!permission.allowed) {
    return NextResponse.json({ error: permission.reason }, { status: 403 });
  }

  const { text, usedFallback } = await generateGroqText({
    system: "Suggest resume skills as a concise comma-separated list.",
    prompt: `Suggest 18 relevant hard and soft skills for a ${parsed.data.jobTitle}. Return only a comma-separated list.`,
    fallback: "Communication, Leadership, Collaboration, Problem Solving, Data Analysis, Project Management, Stakeholder Management, Process Improvement, Reporting, Strategy, Planning, Research, Documentation, Prioritization, Quality Assurance, Customer Focus, Presentation, Adaptability"
  });

  await incrementUsage(user.id, "aiGenerations");
  return NextResponse.json({ text, usedFallback });
}
