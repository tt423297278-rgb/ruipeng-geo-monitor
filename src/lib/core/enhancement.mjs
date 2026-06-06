export function buildEnhancedPrompt(question, sources) {
  const evidence = sources
    .map(
      (source, index) =>
        `[资料 ${index + 1}] ${source.title}\n来源类型：${source.sourceType}\n链接：${source.url || "无"}\n内容：${source.content}`,
    )
    .join("\n\n");

  return [
    "你是执行 GEO 品牌监测的事实型问答助手。",
    "请优先依据下面提供的项目资料和联网搜索资料回答用户问题。",
    "严禁编造门店名称、地址、电话、官网、设备、医生数量或资质。",
    "资料中没有明确出现的事实，必须写“根据现有资料无法确认”，不要依赖模糊记忆补全。",
    "回答末尾列出使用过的资料标题；若没有联网资料，明确说明“本回答未使用联网搜索资料”。",
    "",
    `用户问题：${question}`,
    "",
    evidence || "当前没有可用资料。",
  ].join("\n");
}

export function findMatchedKeywords(answer, terms) {
  const normalized = String(answer || "").toLowerCase().replace(/[\s-]+/g, "");
  return terms.filter((term) => normalized.includes(String(term).toLowerCase().replace(/[\s-]+/g, "")));
}
