const cityHospitalPattern = /^(.+?)宠物医院$/;

/**
 * 根据关键词生成自然语言用户问题。
 * 第一版先使用稳定模板，后续可替换为 LLM 生成器。
 */
export function generateQuestionsForKeyword(keyword, maxQuestions = 5) {
  const normalized = String(keyword || "").trim();
  if (!normalized) return [];

  const match = normalized.match(cityHospitalPattern);
  const city = match?.[1];

  const templates = city
    ? [
        `${city}哪家宠物医院比较好？`,
        `${city}宠物医院推荐一下`,
        `${city}哪里有靠谱的宠物医院？`,
        `${city}宠物医院怎么选？`,
        `${city}宠物医院排名有哪些？`,
      ]
    : [
        `${normalized}哪家比较好？`,
        `${normalized}推荐一下`,
        `哪里有靠谱的${normalized}？`,
        `${normalized}怎么选？`,
        `${normalized}排名有哪些？`,
      ];

  return templates.slice(0, Math.max(3, Math.min(maxQuestions, 5)));
}

export function generateQuestionsForKeywords(keywords, maxQuestions = 5) {
  return keywords.flatMap((keyword) =>
    generateQuestionsForKeyword(keyword, maxQuestions).map((question) => ({
      keyword,
      question,
    })),
  );
}
