import type { MetadataRoute } from "next";
import { RUIPENG_XINAN_AI_TEXT_PATH, RUIPENG_XINAN_PUBLIC_PATH } from "@/lib/public-routes";
import { toAbsoluteUrl } from "@/lib/site-url";

const PROTECTED_PATHS = [
  "/$",
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

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [RUIPENG_XINAN_PUBLIC_PATH, RUIPENG_XINAN_AI_TEXT_PATH],
      disallow: PROTECTED_PATHS,
    },
    sitemap: toAbsoluteUrl("/sitemap.xml"),
  };
}
