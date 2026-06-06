import test from "node:test";
import assert from "node:assert/strict";

import { generateQuestionsForKeyword } from "../src/lib/core/question-generator.mjs";
import { checkExposure } from "../src/lib/core/exposure-checker.mjs";

test("关键词会生成 5 个自然用户问题", () => {
  const questions = generateQuestionsForKeyword("重庆宠物医院");

  assert.equal(questions.length, 5);
  assert.deepEqual(questions, [
    "重庆哪家宠物医院比较好？",
    "重庆宠物医院推荐一下",
    "重庆哪里有靠谱的宠物医院？",
    "重庆宠物医院怎么选？",
    "重庆宠物医院排名有哪些？",
  ]);
});

test("曝光检测会识别品牌、官网、电话、地址和前段出现位置", () => {
  const result = checkExposure({
    answer:
      "瑞鹏宠物医院是重庆常见的宠物医疗机构，官网是 https://ruipeng.com，电话 400-123-4567，地址在重庆市渝北区。",
    brandName: "瑞鹏宠物医院",
    officialWebsite: "https://ruipeng.com",
    phone: "400-123-4567",
    address: "重庆市渝北区",
    competitors: ["某某宠物医院"],
  });

  assert.equal(result.brandMentioned, true);
  assert.equal(result.websiteMentioned, true);
  assert.equal(result.phoneMentioned, true);
  assert.equal(result.addressMentioned, true);
  assert.equal(result.brandMentionCount, 1);
  assert.equal(result.brandPosition, "EARLY");
  assert.equal(result.competitorMentioned, false);
  assert.equal(result.score, 100);
});

test("只出现竞品且没有本品牌时扣分但不低于 0", () => {
  const result = checkExposure({
    answer: "你可以了解某某宠物医院，服务范围比较广。",
    brandName: "瑞鹏宠物医院",
    officialWebsite: "https://ruipeng.com",
    phone: "400-123-4567",
    address: "重庆市渝北区",
    competitors: ["某某宠物医院"],
  });

  assert.equal(result.brandMentioned, false);
  assert.equal(result.competitorMentioned, true);
  assert.equal(result.score, 0);
});
