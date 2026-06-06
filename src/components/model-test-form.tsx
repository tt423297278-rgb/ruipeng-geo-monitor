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
  initialProvider: string;
  initialModel: string;
  initialQuestion: string;
};

export function ModelTestForm({
  options,
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

  return (
    <form action="/model-test" className="rounded-md border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-base font-black">手动测试问题</h2>
      <div className="grid gap-4">
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
            defaultValue={initialQuestion}
            placeholder="重庆哪家宠物医院比较好？"
            required
          />
        </label>
        <button type="submit">运行一次测试</button>
      </div>
    </form>
  );
}
