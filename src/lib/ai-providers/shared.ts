import type { CallAIProviderResult, ProviderRuntimeConfig } from "./types";

type OpenAICompatibleOptions = ProviderRuntimeConfig & {
  providerLabel: string;
};

export function createMockResponse(providerLabel: string, model: string, question: string): CallAIProviderResult {
  const answer = `【Mock ${providerLabel}】已收到问题：“${question}”。当前未配置 API Key，因此返回模拟回答。`;

  return {
    success: true,
    answer,
    rawResponse: {
      mock: true,
      provider: providerLabel,
      model,
      question,
    },
    errorMessage: "",
  };
}

export async function callOpenAICompatibleProvider({
  apiKey,
  baseUrl,
  model,
  question,
  providerLabel,
}: OpenAICompatibleOptions): Promise<CallAIProviderResult> {
  // MVP 阶段允许 mock 模式：不配置 Key 也能测试页面和保存链路。
  if (!apiKey || !baseUrl || !model) {
    return createMockResponse(providerLabel, model || "mock-model", question);
  }

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "你是一个真实用户会使用的 AI 问答助手，请自然、客观地回答问题。",
          },
          {
            role: "user",
            content: question,
          },
        ],
        temperature: 0.2,
      }),
    });

    const rawResponse = await response.json().catch(async () => ({
      text: await response.text().catch(() => ""),
    }));

    if (!response.ok) {
      return {
        success: false,
        answer: "",
        rawResponse,
        errorMessage: `${providerLabel} 调用失败：${response.status}`,
      };
    }

    const answer =
      typeof rawResponse === "object" && rawResponse && "choices" in rawResponse
        ? ((rawResponse as { choices?: Array<{ message?: { content?: string } }> }).choices?.[0]?.message
            ?.content ?? "")
        : "";

    return {
      success: true,
      answer,
      rawResponse,
      errorMessage: "",
    };
  } catch (error) {
    return {
      success: false,
      answer: "",
      rawResponse: null,
      errorMessage: error instanceof Error ? error.message : `${providerLabel} 调用异常`,
    };
  }
}
