import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canUseTemplate, defaultTemplateId } from "@/lib/templates";
import { canUseFeature, getTodayUsage } from "@/lib/usage";
import { parseResumeData, resumeDataSchema } from "@/lib/resume";

const resumeSchema = z.object({
  title: z.string().min(1).max(120),
  templateId: z.string().min(1).default(defaultTemplateId),
  data: resumeDataSchema
});

function serializeResume(resume: {
  id: string;
  title: string;
  templateId: string;
  data: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...resume,
    data: parseResumeData(resume.data),
    createdAt: resume.createdAt.toISOString(),
    updatedAt: resume.updatedAt.toISOString()
  };
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resumes = await prisma.resume.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" }
  });

  return NextResponse.json({ resumes: resumes.map(serializeResume) });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = resumeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid resume payload." }, { status: 400 });
  }

  if (!canUseTemplate(user.plan, parsed.data.templateId)) {
    return NextResponse.json({ error: "This template requires Pro." }, { status: 403 });
  }

  const [usage, resumeCount] = await Promise.all([
    getTodayUsage(user.id),
    prisma.resume.count({ where: { userId: user.id } })
  ]);
  const permission = canUseFeature({
    plan: user.plan,
    usage,
    feature: "resume",
    resumeCount
  });

  if (!permission.allowed) {
    return NextResponse.json({ error: permission.reason }, { status: 403 });
  }

  const resume = await prisma.resume.create({
    data: {
      userId: user.id,
      title: parsed.data.title,
      templateId: parsed.data.templateId,
      data: parsed.data.data as Prisma.InputJsonValue
    }
  });

  return NextResponse.json({ resume: serializeResume(resume) }, { status: 201 });
}
