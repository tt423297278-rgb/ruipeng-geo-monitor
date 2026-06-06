import { callOpenAICompatibleProvider } from "./shared";
import type { CallAIProviderResult } from "./types";

export async function callDoubao(model: string, question: string): Promise<CallAIProviderResult> {
  return callOpenAICompatibleProvider({
    providerLabel: "豆包",
    apiKey: process.env.DOUBAO_API_KEY,
    baseUrl: process.env.DOUBAO_BASE_URL || "https://ark.cn-beijing.volces.com/api/v3",
    model: model || process.env.DOUBAO_MODEL || "doubao-mock-model",
    question,
  });
}
