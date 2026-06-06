import { callAIProvider } from "@/lib/ai-providers";
import { buildEnhancedPrompt, findMatchedKeywords } from "@/lib/core/enhancement.mjs";
import { checkExposure } from "@/lib/exposure-check";
import {
  buildProjectKnowledgeSources,
  buildTrackedKnowledgeTerms,
  type ProjectKnowledgeInput,
} from "./project-knowledge";
import { searchWeb } from "./web-search";

type EnhancedCallInput = {
  provider: string;
  model: string;
  question: string;
  project: ProjectKnowledgeInput;
  competitors?: string[];
};

export async function runEnhancedAiCall({
  provider,
  model,
  question,
  project,
  competitors = [],
}: EnhancedCallInput) {
  const projectSources = buildProjectKnowledgeSources(project);
  const webSearch = project.knowledge?.webSearchEnabled
    ? await searchWeb(question)
    : { used: false, results: [], error: "项目未启用联网搜索，已仅使用项目资料增强" };
  const sources = [...projectSources, ...webSearch.results];
  const prompt = buildEnhancedPrompt(question, sources);
  const result = await callAIProvider({ provider, model, question: prompt });
  const exposure = checkExposure({
    answer: result.answer,
    brandName: project.brandName,
    website: project.knowledge?.website || project.officialWebsite,
    phone: project.knowledge?.phone || project.phone,
    address: project.knowledge?.address || project.address,
    competitors,
  });
  const matchedKeywords = findMatchedKeywords(result.answer, buildTrackedKnowledgeTerms(project));

  return {
    ...result,
    enrichmentEnabled: true,
    webSearchUsed: webSearch.used,
    searchError: webSearch.error,
    searchResults: sources,
    prompt,
    exposure,
    matchedKeywords,
  };
}
