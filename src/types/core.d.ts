declare module "@/lib/core/question-generator.mjs" {
  export function generateQuestionsForKeyword(keyword: string, maxQuestions?: number): string[];
  export function generateQuestionsForKeywords(
    keywords: string[],
    maxQuestions?: number,
  ): Array<{ keyword: string; question: string }>;
}

declare module "@/lib/core/exposure-checker.mjs" {
  export type ExposureResult = {
    brandMentioned: boolean;
    websiteMentioned: boolean;
    phoneMentioned: boolean;
    addressMentioned: boolean;
    brandMentionCount: number;
    brandPosition: "NONE" | "EARLY" | "MIDDLE" | "LATE";
    competitorMentioned: boolean;
    score: number;
  };

  export function checkExposure(input: {
    answer: string;
    brandName: string;
    officialWebsite?: string | null;
    phone?: string | null;
    address?: string | null;
    competitors?: string[] | string | null;
  }): ExposureResult;
}
