export type TrendSourceItem = {
  checkedAt: Date | string;
  brandMentioned: boolean;
  competitorMentioned: boolean;
  score: number;
};

export type TrendPoint = {
  dateKey: string;
  label: string;
  calls: number;
  averageScore: number;
  brandMentionRate: number;
  competitorCount: number;
};

export type WordCloudTone = "brand" | "competitor" | "keyword" | "medical" | "neutral";

export type WordCloudTerm = {
  text: string;
  weight: number;
  tone: WordCloudTone;
};

const MEDICAL_TERMS = [
  "24小时",
  "急诊",
  "转诊",
  "宠物医院",
  "动物医院",
  "B超",
  "CT",
  "核磁",
  "骨科",
  "猫科",
  "犬科",
  "皮肤病",
  "血液透析",
  "肿瘤",
  "外科",
  "内科",
  "体检",
  "疫苗",
  "绝育",
  "重庆",
];

const TONE_PRIORITY: Record<WordCloudTone, number> = {
  brand: 5,
  competitor: 4,
  keyword: 3,
  medical: 2,
  neutral: 1,
};

function toDateKey(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function toLabel(dateKey: string) {
  return dateKey.slice(5);
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

export function parseMatchedCompetitors(value?: string | null) {
  if (!value) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  } catch {
    return [];
  }
}

export function buildTrendPoints(items: TrendSourceItem[], limit = 12): TrendPoint[] {
  const grouped = new Map<
    string,
    {
      calls: number;
      brandHits: number;
      competitorCount: number;
      totalScore: number;
    }
  >();

  for (const item of items) {
    const dateKey = toDateKey(item.checkedAt);
    const current = grouped.get(dateKey) || {
      calls: 0,
      brandHits: 0,
      competitorCount: 0,
      totalScore: 0,
    };

    current.calls += 1;
    current.brandHits += item.brandMentioned ? 1 : 0;
    current.competitorCount += item.competitorMentioned ? 1 : 0;
    current.totalScore += item.score;
    grouped.set(dateKey, current);
  }

  return Array.from(grouped.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(-limit)
    .map(([dateKey, item]) => ({
      dateKey,
      label: toLabel(dateKey),
      calls: item.calls,
      averageScore: Math.round(item.totalScore / item.calls),
      brandMentionRate: Math.round((item.brandHits / item.calls) * 100),
      competitorCount: item.competitorCount,
    }));
}

export function buildWordCloudTerms({
  keywords,
  projects,
  responses,
  limit = 18,
}: {
  keywords: Array<{ text: string }>;
  projects: Array<{ brandName: string; competitorNames?: string | null }>;
  responses: Array<{ fullAnswer?: string | null }>;
  limit?: number;
}): WordCloudTerm[] {
  const termMap = new Map<string, WordCloudTerm>();

  const addTerm = (text: string, tone: WordCloudTone, weight = 1) => {
    const normalized = text.trim();
    if (!normalized) {
      return;
    }

    const current = termMap.get(normalized);
    if (!current) {
      termMap.set(normalized, { text: normalized, tone, weight });
      return;
    }

    current.weight += weight;
    if (TONE_PRIORITY[tone] > TONE_PRIORITY[current.tone]) {
      current.tone = tone;
    }
  };

  for (const project of projects) {
    addTerm(project.brandName, "brand", 8);
    for (const competitor of splitCompetitors(project.competitorNames)) {
      addTerm(competitor, "competitor", 5);
    }
  }

  for (const keyword of keywords) {
    addTerm(keyword.text, "keyword", 4);
  }

  // 把关键词和回答合并成语料，第一版用轻量词典抽取医疗场景词，后续可替换为分词服务。
  const corpus = [
    ...keywords.map((item) => item.text),
    ...responses.map((item) => item.fullAnswer || ""),
  ].join("\n");

  for (const term of MEDICAL_TERMS) {
    const matches = corpus.match(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"));
    if (matches?.length) {
      addTerm(term, "medical", matches.length * 2);
    }
  }

  return Array.from(termMap.values())
    .sort((left, right) => right.weight - left.weight || left.text.localeCompare(right.text, "zh-Hans-CN"))
    .slice(0, limit);
}
