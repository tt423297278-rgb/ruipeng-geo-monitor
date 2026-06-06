import test from "node:test";
import assert from "node:assert/strict";

import {
  buildTrendPoints,
  buildWordCloudTerms,
  parseMatchedCompetitors,
} from "../src/lib/dashboard-insights.ts";

test("看板趋势会按日期聚合调用量、平均分和品牌出现率", () => {
  const points = buildTrendPoints([
    {
      checkedAt: new Date("2026-06-03T09:00:00+08:00"),
      brandMentioned: true,
      competitorMentioned: false,
      score: 80,
    },
    {
      checkedAt: new Date("2026-06-03T18:00:00+08:00"),
      brandMentioned: false,
      competitorMentioned: true,
      score: 20,
    },
    {
      checkedAt: new Date("2026-06-04T10:00:00+08:00"),
      brandMentioned: true,
      competitorMentioned: false,
      score: 100,
    },
  ]);

  assert.deepEqual(points, [
    {
      dateKey: "2026-06-03",
      label: "06-03",
      calls: 2,
      averageScore: 50,
      brandMentionRate: 50,
      competitorCount: 1,
    },
    {
      dateKey: "2026-06-04",
      label: "06-04",
      calls: 1,
      averageScore: 100,
      brandMentionRate: 100,
      competitorCount: 0,
    },
  ]);
});

test("看板词云会合并关键词、品牌和回答中的医疗场景词", () => {
  const terms = buildWordCloudTerms({
    keywords: [{ text: "重庆24小时宠物医院" }, { text: "宠物急诊转诊" }],
    projects: [
      {
        brandName: "瑞鹏宠物医院",
        competitorNames: "友好动物医院, 安安宠物医院",
      },
    ],
    responses: [
      {
        fullAnswer: "瑞鹏宠物医院可以做 B超、骨科、猫科、皮肤病和夜间急诊。",
      },
    ],
  });

  const termMap = new Map(terms.map((item) => [item.text, item]));

  assert.equal(termMap.get("瑞鹏宠物医院")?.tone, "brand");
  assert.equal(termMap.get("友好动物医院")?.tone, "competitor");
  assert.equal(termMap.get("重庆24小时宠物医院")?.tone, "keyword");
  assert.equal(termMap.get("B超")?.tone, "medical");
  assert.ok((termMap.get("急诊")?.weight ?? 0) > (termMap.get("B超")?.weight ?? 0));
});

test("竞品匹配字段会容忍空值和非法 JSON", () => {
  assert.deepEqual(parseMatchedCompetitors('["友好动物医院","安安宠物医院"]'), [
    "友好动物医院",
    "安安宠物医院",
  ]);
  assert.deepEqual(parseMatchedCompetitors("not-json"), []);
  assert.deepEqual(parseMatchedCompetitors(null), []);
});
