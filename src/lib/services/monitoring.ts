import { generateQuestionsForKeyword } from "@/lib/core/question-generator.mjs";
import { prisma } from "@/lib/prisma";
import { ensureDefaultProviders } from "./providers";
import { runEnhancedAiCall } from "./enhanced-ai";
import { recordAiCall } from "./ai-call-records";

function splitCompetitors(value?: string | null) {
  return String(value || "")
    .split(/[,，\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function generateMissingQuestions(projectId: string) {
  const keywords = await prisma.keyword.findMany({ where: { projectId } });
  let created = 0;

  for (const keyword of keywords) {
    const questions = generateQuestionsForKeyword(keyword.text);

    for (const question of questions) {
      const result = await prisma.generatedQuestion.upsert({
        where: {
          keywordId_question: {
            keywordId: keyword.id,
            question,
          },
        },
        update: {},
        create: {
          projectId,
          keywordId: keyword.id,
          question,
        },
      });

      if (result.createdAt.getTime() > Date.now() - 5000) {
        created += 1;
      }
    }
  }

  return { created };
}

export async function runProjectMonitoring(projectId: string) {
  await ensureDefaultProviders();
  await generateMissingQuestions(projectId);

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      knowledge: true,
      questions: {
        include: { keyword: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!project) {
    throw new Error("项目不存在");
  }

  const providers = await prisma.aiProvider.findMany({
    where: { enabled: true },
    orderBy: { createdAt: "asc" },
  });

  let responseCount = 0;
  let successCount = 0;

  for (const question of project.questions) {
    for (const provider of providers) {
      const modelName = process.env[provider.modelEnv] || provider.name;
      const callResult = await runEnhancedAiCall({
        provider: provider.name,
        model: modelName,
        question: question.question,
        project: {
          projectName: project.name,
          brandName: project.brandName,
          officialWebsite: project.officialWebsite,
          phone: project.phone,
          address: project.address,
          knowledge: project.knowledge,
        },
        competitors: splitCompetitors(project.competitorNames),
      });

      await recordAiCall({
        projectId: project.id,
        keywordId: question.keywordId,
        questionId: question.id,
        question: question.question,
        providerId: provider.id,
        providerName: provider.displayName,
        modelName,
        result: callResult,
      });

      if (callResult.success) {
        successCount += 1;
      }

      responseCount += 1;
    }
  }

  return { responseCount, successCount };
}
