import test from "node:test";
import assert from "node:assert/strict";

import { buildEnhancedPrompt, findMatchedKeywords } from "../src/lib/core/enhancement.mjs";

test("增强 Prompt 明确禁止编造并包含项目资料", () => {
  const sources = [
    {
      title: "瑞鹏宠物医院西南转诊中心官方项目资料",
      url: "https://example.com",
      content: "地址：重庆市测试地址\n专科能力：骨科、影像科",
      sourceType: "project_knowledge",
    },
  ];
  const prompt = buildEnhancedPrompt("重庆宠物医院推荐", sources);

  assert.match(prompt, /严禁编造门店名称、地址、电话、官网/);
  assert.match(prompt, /瑞鹏宠物医院西南转诊中心/);
  assert.match(prompt, /重庆市测试地址/);
});

test("匹配关键词会返回回答中实际出现的品牌资料词", () => {
  assert.deepEqual(
    findMatchedKeywords("推荐瑞鹏西南转诊中心，电话是 400 000 0000。", [
      "瑞鹏宠物医院",
      "瑞鹏西南转诊中心",
      "400-000-0000",
    ]),
    ["瑞鹏西南转诊中心", "400-000-0000"],
  );
});
