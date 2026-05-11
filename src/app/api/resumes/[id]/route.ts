import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canUseTemplate } from "@/lib/templates";
import { parseResumeData, resumeDataSchema } from "@/lib/resume";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const updateResumeSchema = z.object({
  title: z.string().min(1).max(120),
  templateId: z.string().min(1),
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

export async function PUT(request: Request, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateResumeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid resume payload." }, { status: 400 });
  }

  const existing = await prisma.resume.findFirst({
    where: { id, userId: user.id }
  });
  if (!existing) {
    return NextResponse.json({ error: "Resume not found." }, { status: 404 });
  }

  if (!canUseTemplate(user.plan, parsed.data.templateId)) {
    return NextResponse.json({ error: "This template requires Pro." }, { status: 403 });
  }

  const resume = await prisma.resume.update({
    where: { id },
    data: {
      title: parsed.data.title,
      templateId: parsed.data.templateId,
      data: parsed.data.data as Prisma.InputJsonValue
    }
  });

  return NextResponse.json({ resume: serializeResume(resume) });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.resume.findFirst({
    where: { id, userId: user.id }
  });
  if (!existing) {
    return NextResponse.json({ error: "Resume not found." }, { status: 404 });
  }

  await prisma.resume.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
