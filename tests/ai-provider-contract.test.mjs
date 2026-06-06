import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const base = new URL("../src/lib/ai-providers/", import.meta.url);

test("AI Provider 层包含三平台文件和统一入口", () => {
  for (const filename of ["deepseek.ts", "kimi.ts", "doubao.ts", "index.ts"]) {
    assert.equal(existsSync(new URL(filename, base)), true, `${filename} should exist`);
  }
});

test("统一入口导出 callAIProvider 并保持约定字段", () => {
  const source = readFileSync(new URL("index.ts", base), "utf8");

  assert.match(source, /export\s+async\s+function\s+callAIProvider/);
  for (const field of ["provider", "model", "question", "success", "answer", "rawResponse", "errorMessage"]) {
    assert.match(source, new RegExp(field));
  }
});
