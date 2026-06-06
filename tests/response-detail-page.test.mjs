import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("首页最近回答记录提供查看详情入口", async () => {
  const page = await readFile("src/app/page.tsx", "utf8");

  assert.match(page, /href=\{`\/responses\/\$\{item\.id\}`\}/);
  assert.match(page, /查看/);
});

test("回答详情页展示完整回答和曝光检测信息", async () => {
  const detailPage = await readFile("src/app/responses/[id]/page.tsx", "utf8");

  assert.match(detailPage, /完整回答/);
  assert.match(detailPage, /曝光检测/);
  assert.match(detailPage, /notFound/);
});
