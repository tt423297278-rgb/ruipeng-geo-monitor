import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("Prisma schema 使用 PostgreSQL 并保留生产迁移", async () => {
  const schema = await readFile("prisma/schema.prisma", "utf8");
  const migration = await readFile("prisma/migrations/20260605000100_init_postgresql/migration.sql", "utf8");

  assert.match(schema, /provider\s+=\s+"postgresql"/);
  assert.match(migration, /CREATE TABLE "Project"/);
  assert.match(migration, /CREATE TABLE "ExposureCheck"/);
});

test("环境变量模板只包含占位变量，不包含真实密钥", async () => {
  const example = await readFile(".env.example", "utf8");

  for (const key of [
    "DATABASE_URL=",
    "DEEPSEEK_API_KEY=",
    "KIMI_API_KEY=",
    "DOUBAO_API_KEY=",
    "NEXT_PUBLIC_APP_URL=",
    "CRON_SECRET=",
    "ADMIN_USERNAME=",
    "ADMIN_PASSWORD=",
    "CUSTOMER_USERNAME=",
    "CUSTOMER_PASSWORD=",
    "CUSTOMER_PROJECT_NAME=",
  ]) {
    assert.ok(example.includes(key), `${key} should be present`);
  }

  assert.doesNotMatch(example, /sk-|ep-\d|password123|file:\.\/dev\.db/i);
});

test("上线配置包含 Vercel 与基础访问保护", async () => {
  const vercel = await readFile("vercel.json", "utf8");
  const middleware = await readFile("src/middleware.ts", "utf8");
  const auth = await readFile("src/lib/auth.ts", "utf8");
  const login = await readFile("src/app/login/page.tsx", "utf8");
  const deployDoc = await readFile("DEPLOY.md", "utf8");

  assert.match(vercel, /prisma generate && next build/);
  assert.match(auth, /CUSTOMER_PASSWORD/);
  assert.match(auth, /admin/);
  assert.match(login, /登录/);
  assert.match(deployDoc, /Vercel/);
  assert.match(deployDoc, /prisma migrate deploy/);
});
