import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

const pagePath = "src/app/(public)/hospitals/ruipeng-xinan-referral-center/page.tsx";
const dataPath = "src/data/hospitals/ruipeng-xinan-referral-center.ts";
const siteUrlPath = "src/lib/site-url.ts";
const imageHelperPath = "src/lib/hospital-images.ts";
const imageDirectoryPath = "public/hospitals/ruipeng-xinan-referral-center";
const imageReadmePath = `${imageDirectoryPath}/README.md`;
const publicPath = "/hospitals/ruipeng-xinan-referral-center";

test("公开 GEO 落地页位于 route group 并包含基础 metadata 与主要模块", async () => {
  assert.equal(existsSync(pagePath), true);
  assert.equal(existsSync(dataPath), true);
  const page = await readFile(pagePath, "utf8");
  const data = await readFile(dataPath, "utf8");

  assert.match(page, /ruipengXinanReferralCenter as hospital/);
  assert.match(page, /title: hospital\.seo\.title/);
  assert.match(page, /description: hospital\.seo\.description/);
  assert.match(page, /keywords: \[\.\.\.hospital\.seo\.keywords\]/);
  assert.match(page, /canonical: toAbsoluteUrl\(hospital\.seo\.canonicalPath\)/);
  assert.match(page, /openGraph:/);
  assert.match(page, /twitter:/);
  assert.match(data, /瑞鹏宠物医院西南转诊中心｜重庆宠物转诊与犬猫专科诊疗服务/);
  assert.match(data, /瑞鹏宠物医院西南转诊中心位于重庆/);

  for (const section of ["医院基础信息", "重点诊疗方向", "适合哪些情况来院", "为什么选择", "医院图片展示", "就诊流程", "常见问题"]) {
    assert.match(page, new RegExp(section));
  }

  assert.match(data, /页面内容仅用于医院信息介绍，具体诊疗建议以医生面诊为准。/);
  assert.match(page, /图片待补充/);

  for (const field of [
    "slug",
    "name",
    "shortName",
    "city",
    "district",
    "positioning",
    "heroTitle",
    "heroDescription",
    "address",
    "phone",
    "openingHours",
    "mapUrl",
    "consultationUrl",
    "navigationUrl",
    "images",
    "specialties",
    "visitScenarios",
    "processSteps",
    "advantages",
    "faq",
    "disclaimer",
    "seo",
  ]) {
    assert.match(data, new RegExp(`\\b${field}:`));
  }

  for (const image of ["hero.webp", "exterior.webp", "consulting-room.webp", "equipment.webp", "doctor-team.webp"]) {
    assert.match(data, new RegExp(image.replace(".", "\\.")));
  }

  for (const type of ["hero", "exterior", "consulting-room", "equipment", "doctor-team"]) {
    assert.match(data, new RegExp(`type: "${type}"`));
  }
});

test("医院图片目录、说明和缺图安全处理已配置", async () => {
  assert.equal(existsSync(imageDirectoryPath), true);
  assert.equal(existsSync(imageReadmePath), true);
  assert.equal(existsSync(imageHelperPath), true);

  const page = await readFile(pagePath, "utf8");
  const data = await readFile(dataPath, "utf8");
  const helper = await readFile(imageHelperPath, "utf8");
  const readme = await readFile(imageReadmePath, "utf8");

  assert.match(page, /hasPublicImage\(image\.src\)/);
  assert.match(page, /image\.available \?/);
  assert.match(page, /<ImagePlaceholder alt=\{image\.alt\}/);
  assert.match(page, /图片待补充/);
  assert.match(helper, /existsSync\(imagePath\)/);
  assert.match(helper, /process\.cwd\(\), "public"/);

  for (const alt of [
    "瑞鹏宠物医院西南转诊中心门头照片",
    "瑞鹏宠物医院西南转诊中心接待与候诊环境",
    "瑞鹏宠物医院西南转诊中心诊室环境",
    "瑞鹏宠物医院西南转诊中心医疗设备展示",
    "瑞鹏宠物医院西南转诊中心医生团队展示",
  ]) {
    assert.match(data, new RegExp(alt));
  }

  for (const filename of ["hero.webp", "exterior.webp", "consulting-room.webp", "equipment.webp", "doctor-team.webp"]) {
    assert.match(readme, new RegExp(filename.replace(".", "\\.")));
  }

  assert.match(readme, /真实、准确、可公开的医院图片/);
  assert.match(readme, /不要使用误导性的 AI 生成图片冒充真实医院场景/);
  assert.match(readme, /Open Graph 图片使用 `hero\.webp`/);
});

test("公开落地页从配置生成三类 JSON-LD 并过滤待补充字段", async () => {
  const page = await readFile(pagePath, "utf8");
  const data = await readFile(dataPath, "utf8");
  const siteUrl = await readFile(siteUrlPath, "utf8");

  assert.match(page, /type="application\/ld\+json"/);
  assert.match(page, /\["LocalBusiness", "VeterinaryCare"\]/);
  assert.match(page, /"@type": "FAQPage"/);
  assert.match(page, /mainEntity: hospital\.faq\.map/);
  assert.match(page, /"@type": "BreadcrumbList"/);
  assert.match(page, /isConfirmedPublicValue\(hospital\.address\)/);
  assert.match(page, /isConfirmedPublicValue\(hospital\.phone\)/);
  assert.match(page, /isConfirmedPublicValue\(hospital\.openingHours\)/);

  for (const field of ["keywords", "canonicalPath", "ogImage", "noIndex"]) {
    assert.match(data, new RegExp(`\\b${field}:`));
  }

  assert.match(siteUrl, /NEXT_PUBLIC_SITE_URL/);
  assert.match(siteUrl, /http:\/\/8\.156\.34\.186/);
  assert.match(siteUrl, /不适合作为长期 canonical/);
});

test("公开落地页不包含禁止宣传词", async () => {
  const page = await readFile(pagePath, "utf8");
  const data = await readFile(dataPath, "utf8");

  for (const prohibited of ["第一", "最好", "唯一", "顶级", "权威第一", "包治", "保证治好"]) {
    assert.doesNotMatch(page, new RegExp(prohibited));
    assert.doesNotMatch(data, new RegExp(prohibited));
  }
});

test("middleware 只精确公开目标页面且后台路径仍受保护", async () => {
  const publicRoutes = await readFile("src/lib/public-routes.ts", "utf8");
  const middleware = await readFile("src/middleware.ts", "utf8");

  assert.match(publicRoutes, new RegExp(publicPath.replaceAll("/", "\\/")));
  assert.doesNotMatch(publicRoutes, /pathname\.startsWith\("\/hospitals/);
  assert.match(middleware, /isPublicRequestPath/);

  for (const protectedPath of ["/projects", "/keywords", "/questions", "/model-test", "/responses", "/exposure"]) {
    assert.doesNotMatch(publicRoutes, new RegExp(`"${protectedPath}"`));
  }
});

test("RouteAwareShell 对已登录用户访问公开落地页时跳过后台侧边栏", async () => {
  const appShell = await readFile("src/components/app-shell.tsx", "utf8");
  const routeAwareShell = await readFile("src/components/route-aware-shell.tsx", "utf8");

  assert.match(appShell, /RouteAwareShell/);
  assert.match(routeAwareShell, /usePathname/);
  assert.match(routeAwareShell, /isPublicPagePath\(pathname\)/);
});
