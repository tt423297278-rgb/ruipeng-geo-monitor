import { callOpenAICompatibleProvider } from "./shared";
import type { CallAIProviderResult } from "./types";

export async function callDeepSeek(model: string, question: string): Promise<CallAIProviderResult> {
  return callOpenAICompatibleProvider({
    providerLabel: "DeepSeek",
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseUrl: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
    model: model || process.env.DEEPSEEK_MODEL || "deepseek-chat",
    question,
  });
}
