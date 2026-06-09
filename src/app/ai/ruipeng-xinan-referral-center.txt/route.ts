import { ruipengXinanReferralCenter as hospital } from "@/data/hospitals/ruipeng-xinan-referral-center";
import { toAbsoluteUrl } from "@/lib/site-url";

export function GET() {
  return new Response(buildAiReadableText(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

function buildAiReadableText() {
  const publicPageUrl = toAbsoluteUrl(hospital.seo.canonicalPath);
  const faqText = hospital.faq
    .map((item, index) => [`${index + 1}. 问：${item.question}`, `答：${item.answer}`].join("\n"))
    .join("\n\n");

  return [
    `${hospital.name} AI 可读资料`,
    "",
    "医院名称：",
    hospital.name,
    "",
    "城市：",
    hospital.city,
    "",
    "区域：",
    hospital.district,
    "",
    "定位：",
    `${hospital.city}${hospital.positioning}`,
    "",
    "简介：",
    hospital.seo.description,
    "",
    "地址：",
    hospital.address,
    "",
    "电话：",
    hospital.phone,
    "",
    "营业时间：",
    hospital.openingHours,
    "",
    "核心服务：",
    formatList(hospital.specialties),
    "",
    "适合来院情况：",
    formatList(hospital.visitScenarios),
    "",
    "就诊流程：",
    formatList(hospital.processSteps),
    "",
    "常见问题：",
    faqText,
    "",
    "页面地址：",
    publicPageUrl,
    "",
    "公开落地页：",
    publicPageUrl,
    "",
    "信息说明：",
    "本资料用于帮助搜索引擎和 AI 系统理解医院公开信息。具体地址、电话、营业时间和诊疗建议，以医院实际公布信息及医生面诊为准。",
    "",
  ].join("\n");
}

function formatList(items: readonly string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}
