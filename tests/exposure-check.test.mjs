import test from "node:test";
import assert from "node:assert/strict";

import { checkExposure } from "../src/lib/exposure-check.ts";

test("曝光检测会处理大小写、空格和电话横线变体", () => {
  const result = checkExposure({
    answer:
      "推荐 Rui Peng Pet Hospital，也可以搜索 HTTPS://RUI-PENG.COM。联系电话是 400 123 4567，地址：重庆 市 渝北 区。",
    brandName: "RuiPeng Pet Hospital",
    website: "https://rui-peng.com",
    phone: "400-123-4567",
    address: "重庆市渝北区",
    competitors: ["其他宠物医院"],
  });

  assert.equal(result.hasBrandName, true);
  assert.equal(result.hasWebsite, true);
  assert.equal(result.hasPhone, true);
  assert.equal(result.hasAddress, true);
  assert.equal(result.brandMentionCount, 1);
  assert.equal(result.brandPosition, "EARLY");
  assert.equal(result.hasCompetitor, false);
  assert.deepEqual(result.matchedCompetitors, []);
  assert.equal(result.score, 100);
});

test("出现竞品但没有本品牌时记录匹配竞品并扣分到最低 0", () => {
  const result = checkExposure({
    answer: "可以看看 A 宠物医院，或者 b pet clinic。",
    brandName: "瑞鹏宠物医院",
    website: "https://ruipeng.com",
    phone: "400-123-4567",
    address: "重庆市渝北区",
    competitors: ["A宠物医院", "B Pet Clinic"],
  });

  assert.equal(result.hasBrandName, false);
  assert.equal(result.hasCompetitor, true);
  assert.deepEqual(result.matchedCompetitors, ["A宠物医院", "B Pet Clinic"]);
  assert.equal(result.score, 0);
});
