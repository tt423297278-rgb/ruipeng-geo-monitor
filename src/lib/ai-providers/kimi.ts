import { callOpenAICompatibleProvider } from "./shared";
import type { CallAIProviderResult } from "./types";

export async function callKimi(model: string, question: string): Promise<CallAIProviderResult> {
  return callOpenAICompatibleProvider({
    providerLabel: "Kimi",
    apiKey: process.env.KIMI_API_KEY,
    baseUrl: process.env.KIMI_BASE_URL || "https://api.moonshot.cn/v1",
    model: model || process.env.KIMI_MODEL || "moonshot-v1-8k",
    question,
  });
}
