import { NextResponse } from "next/server";
import { z } from "zod";
import { generateGroqText } from "@/lib/ai";
import { getCurrentUser } from "@/lib/auth";
import { canUseFeature, getTodayUsage, incrementUsage } from "@/lib/usage";

const schema = z.object({
  jobTitle: z.string().min(1),
  skills: z.string().min(1),
  experience: z.string().min(1)
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Provide job title, skills, and experience." }, { status: 400 });
  }

  const usage = await getTodayUsage(user.id);
  const permission = canUseFeature({ plan: user.plan, usage, feature: "ai" });
  if (!permission.allowed) {
    return NextResponse.json({ error: permission.reason }, { status: 403 });
  }

  const { text, usedFallback } = await generateGroqText({
    system: "You are an expert resume writer. Write concise, ATS-friendly resume content.",
    prompt: `Generate a professional resume summary for a ${parsed.data.jobTitle}. Skills: ${parsed.data.skills}. Experience: ${parsed.data.experience}. Keep it 3-4 lines and achievement-oriented.`,
    fallback: `Results-focused ${parsed.data.jobTitle} with experience applying ${parsed.data.skills} to deliver measurable outcomes. Skilled at translating business needs into practical execution, improving workflows, and communicating clearly with stakeholders.`
  });

  await incrementUsage(user.id, "aiGenerations");
  return NextResponse.json({ text, usedFallback });
}
