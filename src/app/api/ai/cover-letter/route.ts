import { NextResponse } from "next/server";
import { z } from "zod";
import { generateGroqText } from "@/lib/ai";
import { getCurrentUser } from "@/lib/auth";
import { canUseFeature, getTodayUsage, incrementUsage } from "@/lib/usage";

const schema = z.object({
  jobTitle: z.string().min(1),
  companyName: z.string().min(1),
  skills: z.string().min(1),
  jobDescription: z.string().min(1),
  tone: z.enum(["professional", "friendly", "confident"]).default("professional")
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Provide job title, company, skills, job description, and tone." }, { status: 400 });
  }

  const usage = await getTodayUsage(user.id);
  const coverPermission = canUseFeature({ plan: user.plan, usage, feature: "coverLetter" });
  const aiPermission = canUseFeature({ plan: user.plan, usage, feature: "ai" });
  if (!coverPermission.allowed || !aiPermission.allowed) {
    return NextResponse.json({ error: coverPermission.reason || aiPermission.reason }, { status: 403 });
  }

  const { text, usedFallback } = await generateGroqText({
    system: "You are an expert career writer. Write concise, customized cover letters.",
    prompt: `Generate a concise ${parsed.data.tone} cover letter for the ${parsed.data.jobTitle} role at ${parsed.data.companyName}. Candidate skills: ${parsed.data.skills}. Job description: ${parsed.data.jobDescription}. Use a clear opening, specific middle paragraph, and short closing.`,
    fallback: `Dear Hiring Team,\n\nI am excited to apply for the ${parsed.data.jobTitle} role at ${parsed.data.companyName}. My background in ${parsed.data.skills} aligns well with the needs described in the role, and I would welcome the opportunity to contribute with focus, ownership, and measurable execution.\n\nThank you for your consideration. I look forward to the possibility of discussing how my experience can support your team.\n\nSincerely,\n${user.name}`
  });

  await incrementUsage(user.id, "coverLetters");
  await incrementUsage(user.id, "aiGenerations");
  return NextResponse.json({ text, usedFallback });
}
