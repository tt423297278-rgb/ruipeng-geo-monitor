import { ModelTestForm } from "@/components/model-test-form";
import { PageHeader } from "@/components/page-header";
import { AI_PROVIDER_OPTIONS } from "@/lib/ai-providers";
import { prisma } from "@/lib/prisma";

type ModelTestPageProps = {
  searchParams?: {
    provider?: string;
    model?: string;
    question?: string;
  };
};

export const dynamic = "force-dynamic";

function getSelectedOption(provider: string) {
  return AI_PROVIDER_OPTIONS.find((item) => item.provider === provider) || AI_PROVIDER_OPTIONS[0];
}

function resolveModel(provider: string, model?: string) {
  const selectedOption = getSelectedOption(provider);
  const submittedModel = String(model || "").trim();
  const otherProviderDefaults = AI_PROVIDER_OPTIONS.filter((item) => item.provider !== provider).map(
    (item) => item.defaultModel,
  );

  // 避免页面从 DeepSeek 切到豆包后，还把 deepseek-chat 当作豆包模型提交。
  if (!submittedModel || otherProviderDefaults.includes(submittedModel)) {
    return selectedOption.defaultModel;
  }

  return submittedModel;
}

export default async function ModelTestPage({ searchParams }: ModelTestPageProps) {
  const provider = searchParams?.provider || "deepseek";
  const model = resolveModel(provider, searchParams?.model);
  const question = searchParams?.question || "";
  const projects = await prisma.project.findMany({
    select: { id: true, name: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHeader
        title="模型测试"
        description="通过后端 API Route 使用项目资料和可选联网搜索进行增强测试。API Key 只保存在服务端环境变量中。"
      />

      <ModelTestForm
        options={AI_PROVIDER_OPTIONS}
        projects={projects}
        initialProvider={provider}
        initialModel={model}
        initialQuestion={question}
      />
    </>
  );
}
