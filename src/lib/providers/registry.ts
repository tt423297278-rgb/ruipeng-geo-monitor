import type { ProviderConfig } from "./types";

export const DEFAULT_PROVIDERS: ProviderConfig[] = [
  {
    name: "deepseek",
    displayName: "DeepSeek",
    baseUrlEnv: "DEEPSEEK_BASE_URL",
    apiKeyEnv: "DEEPSEEK_API_KEY",
    modelEnv: "DEEPSEEK_MODEL",
    enabled: true,
  },
  {
    name: "kimi",
    displayName: "Kimi",
    baseUrlEnv: "KIMI_BASE_URL",
    apiKeyEnv: "KIMI_API_KEY",
    modelEnv: "KIMI_MODEL",
    enabled: true,
  },
  {
    name: "doubao",
    displayName: "豆包",
    baseUrlEnv: "DOUBAO_BASE_URL",
    apiKeyEnv: "DOUBAO_API_KEY",
    modelEnv: "DOUBAO_MODEL",
    enabled: true,
  },
];
