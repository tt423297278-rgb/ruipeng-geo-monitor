import type { KnowledgeSource } from "./project-knowledge";

export type WebSearchResult = {
  used: boolean;
  results: KnowledgeSource[];
  error: string;
};

export async function searchWeb(question: string): Promise<WebSearchResult> {
  const apiKey = process.env.WEB_SEARCH_API_KEY;
  const baseUrl = process.env.WEB_SEARCH_BASE_URL || "https://api.tavily.com/search";

  if (!apiKey) {
    return { used: false, results: [], error: "未配置 WEB_SEARCH_API_KEY，已仅使用项目资料增强" };
  }

  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query: question,
        search_depth: "advanced",
        max_results: 5,
        include_answer: false,
        include_raw_content: false,
      }),
    });
    const payload = (await response.json()) as {
      results?: Array<{ title?: string; url?: string; content?: string }>;
      detail?: string;
    };

    if (!response.ok) {
      return {
        used: false,
        results: [],
        error: payload.detail || `联网搜索失败：${response.status}`,
      };
    }

    return {
      used: true,
      error: "",
      results: (payload.results || []).map((item) => ({
        title: item.title || "联网搜索资料",
        url: item.url || "",
        content: item.content || "",
        sourceType: "web_search" as const,
      })),
    };
  } catch (error) {
    return {
      used: false,
      results: [],
      error: error instanceof Error ? error.message : "联网搜索异常",
    };
  }
}
