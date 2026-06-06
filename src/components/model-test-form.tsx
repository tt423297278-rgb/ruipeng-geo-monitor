"use client";

import { useMemo, useState } from "react";
import type { AIProviderName } from "@/lib/ai-providers";

type ProviderOption = {
  provider: AIProviderName;
  label: string;
  defaultModel: string;
};

type ModelTestFormProps = {
  options: ProviderOption[];
  projects: Array<{ id: string; name: string }>;
  initialProvider: string;
  initialModel: string;
  initialQuestion: string;
};

export function ModelTestForm({
  options,
  projects,
  initialProvider,
  initialModel,
  initialQuestion,
}: ModelTestFormProps) {
  const defaultByProvider = useMemo(
    () => new Map(options.map((item) => [item.provider, item.defaultModel])),
    [options],
  );
  const [provider, setProvider] = useState(initialProvider);
  const [model, setModel] = useState(initialModel);
  const [projectId, setProjectId] = useState(projects[0]?.id || "");
  const [question, setQuestion] = useState(initialQuestion);
  const [result, setResult] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);

  const runTest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/ai/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, provider, model, question }),
      });
      const payload = await response.json();
      setResult(payload);
    } catch (error) {
      setResult({ success: false, errorMessage: error instanceof Error ? error.message : "请求失败" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <form onSubmit={runTest} className="rounded-md border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-base font-black">手动测试增强问答</h2>
        <div className="grid gap-4">
          <label className="text-sm font-semibold">
            项目资料
            <select name="projectId" value={projectId} onChange={(event) => setProjectId(event.target.value)} required>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
        <label className="text-sm font-semibold">
          模型平台
          <select
            name="provider"
            value={provider}
            onChange={(event) => {
              const nextProvider = event.target.value;
              setProvider(nextProvider);
              setModel(defaultByProvider.get(nextProvider as AIProviderName) || "");
            }}
          >
            {options.map((item) => (
              <option key={item.provider} value={item.provider}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          模型名
          <input
            name="model"
            value={model}
            onChange={(event) => setModel(event.target.value)}
            placeholder="deepseek-chat / moonshot-v1-8k / ep-..."
          />
        </label>
        <label className="text-sm font-semibold">
          用户问题
          <textarea
            name="question"
            rows={6}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="重庆哪家宠物医院比较好？"
            required
          />
        </label>
          <button type="submit" disabled={loading || !projectId}>
            {loading ? "正在增强检索并调用模型..." : "运行一次增强测试"}
          </button>
        </div>
      </form>

      <div className="rounded-md border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-base font-black">返回结果</h2>
        {!result ? (
          <p className="text-sm text-slate-500">提交后，这里会显示项目资料、联网搜索状态、模型回答和命中结果。</p>
        ) : (
          <pre className="max-h-[640px] overflow-auto whitespace-pre-wrap rounded-md bg-slate-50 p-4 text-xs leading-6 text-slate-800">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </section>
  );
}
