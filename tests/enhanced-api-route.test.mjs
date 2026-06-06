import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("模型测试通过受保护的后端 API Route 调用增强服务", async () => {
  const form = await readFile("src/components/model-test-form.tsx", "utf8");
  const route = await readFile("src/app/api/ai/call/route.ts", "utf8");

  assert.match(form, /fetch\("\/api\/ai\/call"/);
  assert.doesNotMatch(form, /API_KEY/);
  assert.match(route, /verifyAuthToken/);
  assert.match(route, /session\?\.role !== "admin"/);
  assert.match(route, /runEnhancedAiCall/);
  assert.match(route, /recordAiCall/);
});

test("增强监测持久化搜索资料、Prompt、原始响应和命中字段", async () => {
  const records = await readFile("src/lib/services/ai-call-records.ts", "utf8");

  for (const field of [
    "searchResults",
    "prompt",
    "rawResponse",
    "mentionedBrand",
    "mentionedAddress",
    "mentionedPhone",
    "mentionedWebsite",
    "matchedKeywords",
  ]) {
    assert.match(records, new RegExp(field));
  }
});
