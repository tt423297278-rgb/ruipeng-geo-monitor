import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

const routePath = "src/app/ai/ruipeng-xinan-referral-center.txt/route.ts";
const publicRoutesPath = "src/lib/public-routes.ts";

test("AI 可读资料页从医院配置生成 UTF-8 纯文本", async () => {
  assert.equal(existsSync(routePath), true);
  const route = await readFile(routePath, "utf8");

  assert.match(route, /ruipengXinanReferralCenter as hospital/);
  assert.match(route, /text\/plain; charset=utf-8/);
  assert.match(route, /hospital\.specialties/);
  assert.match(route, /hospital\.visitScenarios/);
  assert.match(route, /hospital\.processSteps/);
  assert.match(route, /hospital\.faq/);
  assert.match(route, /toAbsoluteUrl\(hospital\.seo\.canonicalPath\)/);
  assert.doesNotMatch(route, /第一|最好|唯一|顶级|权威第一|保证治好|包治/);
});

test("AI 资料页只被精确公开，没有开放整个 AI 目录", async () => {
  const publicRoutes = await readFile(publicRoutesPath, "utf8");

  assert.match(publicRoutes, /RUIPENG_XINAN_AI_TEXT_PATH = "\/ai\/ruipeng-xinan-referral-center\.txt"/);
  assert.match(publicRoutes, /RUIPENG_XINAN_AI_TEXT_PATH,/);
  assert.doesNotMatch(publicRoutes, /pathname\.startsWith\("\/ai/);
});
