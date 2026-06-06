import { checkExposure } from "@/lib/exposure-check";
import { generateQuestionsForKeyword } from "@/lib/core/question-generator.mjs";
import { prisma } from "@/lib/prisma";
import { callAIProvider } from "@/lib/ai-providers";
import { ensureDefaultProviders } from "./providers";

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
      const callResult = await callAIProvider({
        provider: provider.name,
        model: modelName,
        question: question.question,
      });

      const aiResponse = await prisma.aiResponse.create({
        data: {
          projectId: project.id,
          keywordId: question.keywordId,
          questionId: question.id,
          providerId: provider.id,
          providerName: provider.displayName,
          modelName,
          fullAnswer: callResult.answer,
          success: callResult.success,
          failureReason: callResult.errorMessage,
        },
      });

      if (callResult.success) {
        successCount += 1;
      }

      const exposure = checkExposure({
        answer: callResult.answer,
        brandName: project.brandName,
        website: project.officialWebsite,
        phone: project.phone,
        address: project.address,
        competitors: splitCompetitors(project.competitorNames),
      });

      await prisma.exposureCheck.create({
        data: {
          responseId: aiResponse.id,
          brandMentioned: exposure.hasBrandName,
          websiteMentioned: exposure.hasWebsite,
          phoneMentioned: exposure.hasPhone,
          addressMentioned: exposure.hasAddress,
          brandMentionCount: exposure.brandMentionCount,
          brandPosition: exposure.brandPosition,
          competitorMentioned: exposure.hasCompetitor,
          matchedCompetitors: JSON.stringify(exposure.matchedCompetitors),
          score: exposure.score,
        },
      });

      responseCount += 1;
    }
  }

  return { responseCount, successCount };
}
