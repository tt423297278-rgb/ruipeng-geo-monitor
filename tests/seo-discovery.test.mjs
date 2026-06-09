import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

const sitemapPath = "src/app/sitemap.ts";
const robotsPath = "src/app/robots.ts";
const publicPath = "/hospitals/ruipeng-xinan-referral-center";
const aiTextPath = "/ai/ruipeng-xinan-referral-center.txt";
const protectedPaths = [
  "/login",
  "/projects",
  "/keywords",
  "/questions",
  "/model-test",
  "/responses",
  "/exposure",
  "/api",
  "/dashboard",
  "/admin",
];

test("sitemap 只收录公开医院落地页并使用 siteUrl 工具", async () => {
  assert.equal(existsSync(sitemapPath), true);
  const source = await readFile(sitemapPath, "utf8");

  assert.match(source, /MetadataRoute\.Sitemap/);
  assert.match(source, /toAbsoluteUrl\(RUIPENG_XINAN_PUBLIC_PATH\)/);
  assert.match(source, /toAbsoluteUrl\(RUIPENG_XINAN_AI_TEXT_PATH\)/);
  assert.match(source, /changeFrequency: "weekly"/);
  assert.match(source, /priority: 0\.9/);
  assert.match(source, /priority: 0\.5/);

  for (const path of protectedPaths) {
    assert.doesNotMatch(source, new RegExp(`"${path.replaceAll("/", "\\/")}"`));
  }
});

test("robots 明确允许公开医院页并禁止后台与 API", async () => {
  assert.equal(existsSync(robotsPath), true);
  const source = await readFile(robotsPath, "utf8");

  assert.match(source, /MetadataRoute\.Robots/);
  assert.match(source, /allow: \[RUIPENG_XINAN_PUBLIC_PATH, RUIPENG_XINAN_AI_TEXT_PATH\]/);
  assert.match(source, /sitemap: toAbsoluteUrl\("\/sitemap\.xml"\)/);
  assert.doesNotMatch(source, /disallow:\s*["']\/["']/);

  for (const path of protectedPaths) {
    assert.match(source, new RegExp(`"${path.replaceAll("/", "\\/")}"`));
  }

  assert.doesNotMatch(source, new RegExp(`disallow:\\s*"${publicPath.replaceAll("/", "\\/")}"`));
  assert.doesNotMatch(source, new RegExp(`disallow:\\s*"${aiTextPath.replaceAll("/", "\\/")}"`));
});
