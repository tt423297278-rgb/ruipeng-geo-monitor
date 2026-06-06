import { ModelTestForm } from "@/components/model-test-form";
import { PageHeader } from "@/components/page-header";
import { AI_PROVIDER_OPTIONS, callAIProvider } from "@/lib/ai-providers";

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
  const hasRequest = Boolean(searchParams?.provider && searchParams?.question);
  const result = hasRequest
    ? await callAIProvider({
        provider,
        model,
        question,
      })
    : null;

  return (
    <>
      <PageHeader
        title="模型测试"
        description="选择模型平台、填写模型名和一个用户问题，手动跑一次 Provider 调用。未配置 API Key 时会进入 mock 模式。"
      />

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <ModelTestForm
          options={AI_PROVIDER_OPTIONS}
          initialProvider={provider}
          initialModel={model}
          initialQuestion={question}
        />

        <div className="rounded-md border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-base font-black">返回结果</h2>
          {!result ? (
            <p className="text-sm text-slate-500">提交左侧表单后，这里会显示统一 Provider 返回结构。</p>
          ) : (
            <div className="grid gap-4">
              <div className="grid gap-2 rounded-md bg-slate-50 p-4 text-sm">
                <p>
                  <span className="font-bold">success：</span>
                  {String(result.success)}
                </p>
                <p>
                  <span className="font-bold">errorMessage：</span>
                  {result.errorMessage || "-"}
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm font-bold">answer</p>
                <pre className="max-h-72 overflow-auto rounded-md border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-900">
                  {result.answer || "-"}
                </pre>
              </div>
              <div>
                <p className="mb-2 text-sm font-bold">rawResponse</p>
                <pre className="max-h-72 overflow-auto rounded-md border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-900">
                  {JSON.stringify(result.rawResponse, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
