export type AIProviderName = "deepseek" | "kimi" | "doubao";

export type CallAIProviderInput = {
  provider: AIProviderName | string;
  model: string;
  question: string;
};

export type CallAIProviderResult = {
  success: boolean;
  answer: string;
  rawResponse: unknown;
  errorMessage: string;
};

export type ProviderRuntimeConfig = {
  apiKey?: string;
  baseUrl?: string;
  model: string;
  question: string;
};
