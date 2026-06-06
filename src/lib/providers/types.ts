export type ProviderConfig = {
  id?: string;
  name: string;
  displayName: string;
  baseUrlEnv: string;
  apiKeyEnv: string;
  modelEnv: string;
  enabled: boolean;
};

export type ModelCallInput = {
  question: string;
  brandName: string;
  keyword: string;
};

export type ModelCallResult = {
  success: boolean;
  answer: string;
  modelName?: string;
  failureReason?: string;
};

export interface AiProviderClient {
  call(input: ModelCallInput): Promise<ModelCallResult>;
}
