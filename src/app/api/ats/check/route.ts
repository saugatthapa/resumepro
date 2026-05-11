import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateATSScore } from "@/lib/ats";
import { getCurrentUser } from "@/lib/auth";
import { canUseFeature, getTodayUsage, incrementUsage } from "@/lib/usage";

const schema = z.object({
  resumeText: z.string().min(40),
  jobDescription: z.string().min(40)
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Paste enough resume text and job description text to calculate an ATS score." },
      { status: 400 }
    );
  }

  const usage = await getTodayUsage(user.id);
  const permission = canUseFeature({ plan: user.plan, usage, feature: "ats" });
  if (!permission.allowed) {
    return NextResponse.json({ error: permission.reason }, { status: 403 });
  }

  const result = calculateATSScore(parsed.data.resumeText, parsed.data.jobDescription);
  await incrementUsage(user.id, "atsChecks");

  if (user.plan === "FREE") {
    return NextResponse.json({
      advanced: false,
      result: {
        ...result,
        missingKeywords: result.missingKeywords.slice(0, 5),
        missingHardSkills: [],
        missingSoftSkills: [],
        sectionProblems: [],
        suggestions: result.suggestions.slice(0, 3)
      }
    });
  }

  return NextResponse.json({ advanced: true, result });
}
