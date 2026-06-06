import type { AiProviderClient, ModelCallInput, ModelCallResult, ProviderConfig } from "./types";

export class OpenAiCompatibleProvider implements AiProviderClient {
  constructor(private readonly config: ProviderConfig) {}

  async call(input: ModelCallInput): Promise<ModelCallResult> {
    const apiKey = process.env[this.config.apiKeyEnv];
    const baseUrl = process.env[this.config.baseUrlEnv];
    const modelName = process.env[this.config.modelEnv];

    if (!apiKey || !baseUrl || !modelName) {
      return {
        success: false,
        answer: "",
        modelName,
        failureReason: `缺少 ${this.config.displayName} 的 API Key、Base URL 或模型名配置`,
      };
    }

    try {
      const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            {
              role: "system",
              content:
                "你是普通用户会使用的 AI 搜索/问答助手。请自然回答用户问题，不要为了测试刻意提及品牌。",
            },
            {
              role: "user",
              content: `用户问题：${input.question}\n关键词：${input.keyword}\n目标品牌：${input.brandName}`,
            },
          ],
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          answer: "",
          modelName,
          failureReason: `${this.config.displayName} 调用失败：${response.status} ${errorText.slice(0, 300)}`,
        };
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };

      return {
        success: true,
        answer: data.choices?.[0]?.message?.content || "",
        modelName,
      };
    } catch (error) {
      return {
        success: false,
        answer: "",
        modelName,
        failureReason: error instanceof Error ? error.message : "模型调用异常",
      };
    }
  }
}
