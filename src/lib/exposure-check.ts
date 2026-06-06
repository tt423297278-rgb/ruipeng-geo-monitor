export type BrandPosition = "NONE" | "EARLY" | "MIDDLE" | "LATE";

export type ExposureCheckInput = {
  answer: string;
  brandName: string;
  website?: string | null;
  phone?: string | null;
  address?: string | null;
  competitors?: string[];
};

export type ExposureCheckResult = {
  hasBrandName: boolean;
  hasWebsite: boolean;
  hasPhone: boolean;
  hasAddress: boolean;
  brandMentionCount: number;
  brandPosition: BrandPosition;
  hasCompetitor: boolean;
  matchedCompetitors: string[];
  score: number;
};

function normalizeText(value?: string | null) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .trim();
}

function normalizeWebsite(value?: string | null) {
  return normalizeText(value)
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
}

function normalizePhone(value?: string | null) {
  return String(value || "").replace(/\D+/g, "");
}

function includesVariant(answer: string, target?: string | null) {
  const normalizedTarget = normalizeText(target);
  if (!normalizedTarget) return false;
  return normalizeText(answer).includes(normalizedTarget);
}

function includesWebsite(answer: string, website?: string | null) {
  const normalizedWebsite = normalizeWebsite(website);
  if (!normalizedWebsite) return false;
  return normalizeWebsite(answer).includes(normalizedWebsite);
}

function includesPhone(answer: string, phone?: string | null) {
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) return false;
  return normalizePhone(answer).includes(normalizedPhone);
}

function countVariantOccurrences(answer: string, target: string) {
  const normalizedAnswer = normalizeText(answer);
  const normalizedTarget = normalizeText(target);
  if (!normalizedAnswer || !normalizedTarget) return 0;

  let count = 0;
  let index = normalizedAnswer.indexOf(normalizedTarget);

  while (index >= 0) {
    count += 1;
    index = normalizedAnswer.indexOf(normalizedTarget, index + normalizedTarget.length);
  }

  return count;
}

function getBrandPosition(answer: string, brandName: string): BrandPosition {
  const normalizedAnswer = normalizeText(answer);
  const normalizedBrandName = normalizeText(brandName);
  const index = normalizedAnswer.indexOf(normalizedBrandName);

  if (index < 0) return "NONE";

  const ratio = index / Math.max(normalizedAnswer.length, 1);
  if (ratio <= 0.3) return "EARLY";
  if (ratio <= 0.7) return "MIDDLE";
  return "LATE";
}

export function checkExposure({
  answer,
  brandName,
  website,
  phone,
  address,
  competitors = [],
}: ExposureCheckInput): ExposureCheckResult {
  const safeAnswer = String(answer || "");
  const brandMentionCount = countVariantOccurrences(safeAnswer, brandName);
  const hasBrandName = brandMentionCount > 0;
  const hasWebsite = includesWebsite(safeAnswer, website);
  const hasPhone = includesPhone(safeAnswer, phone);
  const hasAddress = includesVariant(safeAnswer, address);
  const brandPosition = getBrandPosition(safeAnswer, brandName);
  const matchedCompetitors = competitors.filter((competitor) => includesVariant(safeAnswer, competitor));
  const hasCompetitor = matchedCompetitors.length > 0;

  let score = 0;
  if (hasBrandName) score += 40;
  if (hasWebsite) score += 20;
  if (hasPhone) score += 15;
  if (hasAddress) score += 15;
  if (brandPosition === "EARLY") score += 10;
  if (hasCompetitor && !hasBrandName) score -= 20;

  return {
    hasBrandName,
    hasWebsite,
    hasPhone,
    hasAddress,
    brandMentionCount,
    brandPosition,
    hasCompetitor,
    matchedCompetitors,
    score: Math.max(0, Math.min(100, score)),
  };
}
