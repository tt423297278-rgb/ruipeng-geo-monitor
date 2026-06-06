import { prisma } from "@/lib/prisma";

type EnhancedCallResult = {
  success: boolean;
  answer: string;
  rawResponse: unknown;
  errorMessage: string;
  enrichmentEnabled: boolean;
  webSearchUsed: boolean;
  searchError: string;
  searchResults: unknown[];
  prompt: string;
  exposure: {
    hasBrandName: boolean;
    hasWebsite: boolean;
    hasPhone: boolean;
    hasAddress: boolean;
    brandMentionCount: number;
    brandPosition: string;
    hasCompetitor: boolean;
    matchedCompetitors: string[];
    score: number;
  };
  matchedKeywords: string[];
};

type RecordAiCallInput = {
  projectId: string;
  keywordId?: string;
  questionId?: string;
  question: string;
  providerId?: string;
  providerName: string;
  modelName: string;
  result: EnhancedCallResult;
};

export async function recordAiCall({
  projectId,
  keywordId,
  questionId,
  question,
  providerId,
  providerName,
  modelName,
  result,
}: RecordAiCallInput) {
  return prisma.aiResponse.create({
    data: {
      projectId,
      keywordId,
      questionId,
      questionText: question,
      providerId,
      providerName,
      modelName,
      fullAnswer: result.answer,
      success: result.success,
      failureReason: result.errorMessage,
      enrichmentEnabled: result.enrichmentEnabled,
      webSearchUsed: result.webSearchUsed,
      enrichmentError: result.searchError || null,
      searchResults: JSON.stringify(result.searchResults),
      prompt: result.prompt,
      rawResponse: JSON.stringify(result.rawResponse),
      mentionedBrand: result.exposure.hasBrandName,
      mentionedAddress: result.exposure.hasAddress,
      mentionedPhone: result.exposure.hasPhone,
      mentionedWebsite: result.exposure.hasWebsite,
      matchedKeywords: JSON.stringify(result.matchedKeywords),
      exposureCheck: {
        create: {
          brandMentioned: result.exposure.hasBrandName,
          websiteMentioned: result.exposure.hasWebsite,
          phoneMentioned: result.exposure.hasPhone,
          addressMentioned: result.exposure.hasAddress,
          brandMentionCount: result.exposure.brandMentionCount,
          brandPosition: result.exposure.brandPosition,
          competitorMentioned: result.exposure.hasCompetitor,
          matchedCompetitors: JSON.stringify(result.exposure.matchedCompetitors),
          score: result.exposure.score,
        },
      },
    },
  });
}
