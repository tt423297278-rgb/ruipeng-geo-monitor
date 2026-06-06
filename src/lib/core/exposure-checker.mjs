function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countOccurrences(text, term) {
  if (!term) return 0;
  const pattern = new RegExp(escapeRegExp(term), "gi");
  return (text.match(pattern) || []).length;
}

function includesLoose(text, term) {
  return Boolean(term && text.toLowerCase().includes(String(term).toLowerCase()));
}

function getBrandPosition(answer, brandName) {
  const index = answer.toLowerCase().indexOf(String(brandName).toLowerCase());
  if (index < 0) return "NONE";

  const ratio = index / Math.max(answer.length, 1);
  if (ratio <= 0.3) return "EARLY";
  if (ratio <= 0.7) return "MIDDLE";
  return "LATE";
}

/**
 * 对模型回答做第一版曝光检测。
 * 评分规则和用户需求保持一致，最高 100，最低 0。
 */
export function checkExposure({
  answer,
  brandName,
  officialWebsite,
  phone,
  address,
  competitors = [],
}) {
  const text = String(answer || "");
  const brandMentionCount = countOccurrences(text, brandName);
  const brandMentioned = brandMentionCount > 0;
  const websiteMentioned = includesLoose(text, officialWebsite);
  const phoneMentioned = includesLoose(text, phone);
  const addressMentioned = includesLoose(text, address);
  const competitorList = Array.isArray(competitors)
    ? competitors
    : String(competitors || "")
        .split(/[,，\n]/)
        .map((item) => item.trim())
        .filter(Boolean);
  const competitorMentioned = competitorList.some((name) => includesLoose(text, name));
  const brandPosition = getBrandPosition(text, brandName);

  let score = 0;
  if (brandMentioned) score += 40;
  if (websiteMentioned) score += 20;
  if (phoneMentioned) score += 15;
  if (addressMentioned) score += 15;
  if (brandPosition === "EARLY") score += 10;
  if (competitorMentioned && !brandMentioned) score -= 20;

  return {
    brandMentioned,
    websiteMentioned,
    phoneMentioned,
    addressMentioned,
    brandMentionCount,
    brandPosition,
    competitorMentioned,
    score: Math.max(0, Math.min(100, score)),
  };
}
