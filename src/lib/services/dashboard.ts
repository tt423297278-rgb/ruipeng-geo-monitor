import { prisma } from "@/lib/prisma";
import {
  buildTrendPoints,
  buildWordCloudTerms,
  parseMatchedCompetitors,
} from "@/lib/dashboard-insights";
import { ensureDefaultProviders } from "./providers";

export async function getDashboardData(options: { projectName?: string } = {}) {
  await ensureDefaultProviders();
  const projectWhere = options.projectName ? { name: options.projectName } : {};
  const scopedProjectWhere = options.projectName ? { project: projectWhere } : {};

  const [keywordCount, questionCount, responseCount, projects, keywords, exposureChecks, recentResponses, wordCloudResponses] =
    await Promise.all([
      prisma.keyword.count({ where: scopedProjectWhere }),
      prisma.generatedQuestion.count({ where: scopedProjectWhere }),
      prisma.aiResponse.count({ where: scopedProjectWhere }),
      prisma.project.findMany({
        where: projectWhere,
        orderBy: { createdAt: "desc" },
      }),
      prisma.keyword.findMany({
        where: scopedProjectWhere,
        include: {
          _count: {
            select: {
              questions: true,
              responses: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.exposureCheck.findMany({
        where: options.projectName
          ? {
              response: {
                project: projectWhere,
              },
            }
          : {},
        include: {
          response: {
            include: {
              keyword: true,
              project: true,
            },
          },
        },
        orderBy: { checkedAt: "desc" },
      }),
      prisma.aiResponse.findMany({
        where: scopedProjectWhere,
        take: 10,
        orderBy: { calledAt: "desc" },
        include: {
          keyword: true,
          question: true,
          exposureCheck: true,
          project: true,
        },
      }),
      prisma.aiResponse.findMany({
        where: scopedProjectWhere,
        take: 200,
        orderBy: { calledAt: "desc" },
        select: {
          fullAnswer: true,
        },
      }),
    ]);

  const brandMentionedCount = exposureChecks.filter((item) => item.brandMentioned).length;
  const brandMentionRate =
    exposureChecks.length === 0 ? 0 : Math.round((brandMentionedCount / exposureChecks.length) * 100);
  const averageScore =
    exposureChecks.length === 0
      ? 0
      : Math.round(exposureChecks.reduce((sum, item) => sum + item.score, 0) / exposureChecks.length);

  const modelMap = new Map<string, { providerName: string; count: number; totalScore: number }>();
  for (const check of exposureChecks) {
    const providerName = check.response.providerName;
    const current = modelMap.get(providerName) || { providerName, count: 0, totalScore: 0 };
    current.count += 1;
    current.totalScore += check.score;
    modelMap.set(providerName, current);
  }

  const modelComparison = Array.from(modelMap.values()).map((item) => ({
    providerName: item.providerName,
    count: item.count,
    averageScore: Math.round(item.totalScore / item.count),
  }));

  const keywordExposureChecks = exposureChecks.filter(
    (
      item,
    ): item is typeof item & {
      response: typeof item.response & {
        keywordId: string;
        keyword: NonNullable<typeof item.response.keyword>;
      };
    } => Boolean(item.response.keywordId && item.response.keyword),
  );
  const hotKeywords = buildHotKeywords(keywords, keywordExposureChecks);
  const trackedTerms = buildTrackedTerms(projects, exposureChecks);
  const trendPoints = buildTrendPoints(exposureChecks);
  const wordCloudTerms = buildWordCloudTerms({
    keywords,
    projects,
    responses: wordCloudResponses,
  });

  return {
    keywordCount,
    questionCount,
    responseCount,
    brandMentionRate,
    averageScore,
    modelComparison,
    recentResponses,
    hotKeywords,
    trackedTerms,
    trendPoints,
    wordCloudTerms,
  };
}

function splitCompetitors(value?: string | null) {
  if (!value) {
    return [];
  }

  return value
    .split(/[,，、\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildHotKeywords(
  keywords: Array<{
    id: string;
    text: string;
    _count: {
      questions: number;
      responses: number;
    };
  }>,
  exposureChecks: Array<{
    brandMentioned: boolean;
    score: number;
    response: {
      keywordId: string;
      keyword: {
        text: string;
      };
    };
  }>,
) {
  const keywordMap = new Map<
    string,
    {
      id: string;
      text: string;
      questionCount: number;
      callCount: number;
      brandHits: number;
      totalScore: number;
    }
  >();

  for (const keyword of keywords) {
    keywordMap.set(keyword.id, {
      id: keyword.id,
      text: keyword.text,
      questionCount: keyword._count.questions,
      callCount: keyword._count.responses,
      brandHits: 0,
      totalScore: 0,
    });
  }

  for (const check of exposureChecks) {
    const current =
      keywordMap.get(check.response.keywordId) ||
      {
        id: check.response.keywordId,
        text: check.response.keyword.text,
        questionCount: 0,
        callCount: 0,
        brandHits: 0,
        totalScore: 0,
      };

    current.brandHits += check.brandMentioned ? 1 : 0;
    current.totalScore += check.score;
    keywordMap.set(current.id, current);
  }

  return Array.from(keywordMap.values())
    .map((item) => ({
      id: item.id,
      text: item.text,
      questionCount: item.questionCount,
      callCount: item.callCount,
      averageScore: item.callCount === 0 ? 0 : Math.round(item.totalScore / item.callCount),
      brandMentionRate: item.callCount === 0 ? 0 : Math.round((item.brandHits / item.callCount) * 100),
    }))
    .sort(
      (left, right) =>
        right.callCount - left.callCount ||
        right.questionCount - left.questionCount ||
        right.averageScore - left.averageScore,
    )
    .slice(0, 8);
}

function buildTrackedTerms(
  projects: Array<{
    id: string;
    brandName: string;
    officialWebsite?: string | null;
    phone?: string | null;
    address?: string | null;
    competitorNames?: string | null;
  }>,
  exposureChecks: Array<{
    brandMentioned: boolean;
    websiteMentioned: boolean;
    phoneMentioned: boolean;
    addressMentioned: boolean;
    matchedCompetitors: string;
    score: number;
    response: {
      projectId: string;
    };
  }>,
) {
  const checksByProject = new Map<string, typeof exposureChecks>();
  for (const check of exposureChecks) {
    const list = checksByProject.get(check.response.projectId) || [];
    list.push(check);
    checksByProject.set(check.response.projectId, list);
  }

  const items: Array<{
    id: string;
    label: string;
    term: string;
    hits: number;
    total: number;
    rate: number;
    averageScore: number;
  }> = [];

  for (const project of projects) {
    const projectChecks = checksByProject.get(project.id) || [];
    const total = projectChecks.length;
    const baseTerms = [
      { id: `${project.id}-brand`, label: "品牌名", term: project.brandName, hit: (check: (typeof projectChecks)[number]) => check.brandMentioned },
      {
        id: `${project.id}-website`,
        label: "官网",
        term: project.officialWebsite || "",
        hit: (check: (typeof projectChecks)[number]) => check.websiteMentioned,
      },
      { id: `${project.id}-phone`, label: "电话", term: project.phone || "", hit: (check: (typeof projectChecks)[number]) => check.phoneMentioned },
      {
        id: `${project.id}-address`,
        label: "地址",
        term: project.address || "",
        hit: (check: (typeof projectChecks)[number]) => check.addressMentioned,
      },
    ];

    for (const term of baseTerms) {
      if (!term.term) {
        continue;
      }

      const matchedChecks = projectChecks.filter(term.hit);
      const hits = matchedChecks.length;
      items.push({
        id: term.id,
        label: term.label,
        term: term.term,
        hits,
        total,
        rate: total === 0 ? 0 : Math.round((hits / total) * 100),
        averageScore:
          hits === 0 ? 0 : Math.round(matchedChecks.reduce((sum, check) => sum + check.score, 0) / hits),
      });
    }

    for (const competitor of splitCompetitors(project.competitorNames)) {
      const matchedChecks = projectChecks.filter((check) =>
        parseMatchedCompetitors(check.matchedCompetitors).includes(competitor),
      );
      const hits = matchedChecks.length;
      items.push({
        id: `${project.id}-competitor-${competitor}`,
        label: "竞品",
        term: competitor,
        hits,
        total,
        rate: total === 0 ? 0 : Math.round((hits / total) * 100),
        averageScore:
          hits === 0 ? 0 : Math.round(matchedChecks.reduce((sum, check) => sum + check.score, 0) / hits),
      });
    }
  }

  return items.sort((left, right) => right.hits - left.hits || right.rate - left.rate).slice(0, 8);
}
