import { callDeepSeek } from "./deepseek";
import { callDoubao } from "./doubao";
import { callKimi } from "./kimi";
import type { AIProviderName, CallAIProviderInput, CallAIProviderResult } from "./types";

export type { AIProviderName, CallAIProviderInput, CallAIProviderResult };

export const AI_PROVIDER_OPTIONS: Array<{ provider: AIProviderName; label: string; defaultModel: string }> = [
  { provider: "deepseek", label: "DeepSeek", defaultModel: process.env.DEEPSEEK_MODEL || "deepseek-chat" },
  { provider: "kimi", label: "Kimi", defaultModel: process.env.KIMI_MODEL || "moonshot-v1-8k" },
  { provider: "doubao", label: "豆包", defaultModel: process.env.DOUBAO_MODEL || "doubao-mock-model" },
];

export async function callAIProvider({
  provider,
  model,
  question,
}: CallAIProviderInput): Promise<CallAIProviderResult> {
  const normalizedProvider = String(provider).toLowerCase();

  if (!question.trim()) {
    return {
      success: false,
      answer: "",
      rawResponse: null,
      errorMessage: "问题不能为空",
    };
  }

  switch (normalizedProvider) {
    case "deepseek":
      return callDeepSeek(model, question);
    case "kimi":
      return callKimi(model, question);
    case "doubao":
      return callDoubao(model, question);
    default:
      return {
        success: false,
        answer: "",
        rawResponse: null,
        errorMessage: `不支持的模型平台：${provider}`,
      };
  }
}
