import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { runEnhancedAiCall } from "@/lib/services/enhanced-ai";
import { recordAiCall } from "@/lib/services/ai-call-records";
import { ensureDefaultProviders } from "@/lib/services/providers";

export async function POST(request: Request) {
  const session = await verifyAuthToken(cookies().get(AUTH_COOKIE_NAME)?.value);
  const authHeader = request.headers.get("authorization") || "";
  const internalToken = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";

  const hasInternalAccess = Boolean(process.env.CRON_SECRET && internalToken === process.env.CRON_SECRET);

  if (session?.role !== "admin" && !hasInternalAccess) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const body = (await request.json()) as {
    projectId?: string;
    provider?: string;
    model?: string;
    question?: string;
  };

  if (!body.projectId || !body.provider || !body.model || !body.question?.trim()) {
    return NextResponse.json({ error: "缺少 projectId、provider、model 或 question" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({
    where: { id: body.projectId },
    include: { knowledge: true },
  });

  if (!project) {
    return NextResponse.json({ error: "项目不存在" }, { status: 404 });
  }

  const result = await runEnhancedAiCall({
    provider: body.provider,
    model: body.model,
    question: body.question,
    project: {
      projectName: project.name,
      brandName: project.brandName,
      officialWebsite: project.officialWebsite,
      phone: project.phone,
      address: project.address,
      knowledge: project.knowledge,
    },
    competitors: String(project.competitorNames || "")
      .split(/[,，、\n]/)
      .map((item) => item.trim())
      .filter(Boolean),
  });

  await ensureDefaultProviders();
  const configuredProvider = await prisma.aiProvider.findUnique({
    where: { name: body.provider.toLowerCase() },
  });
  const record = await recordAiCall({
    projectId: project.id,
    question: body.question.trim(),
    providerId: configuredProvider?.id,
    providerName: configuredProvider?.displayName || body.provider,
    modelName: body.model,
    result,
  });

  return NextResponse.json({ ...result, responseId: record.id });
}
