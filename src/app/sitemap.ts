import type { MetadataRoute } from "next";
import { RUIPENG_XINAN_AI_TEXT_PATH, RUIPENG_XINAN_PUBLIC_PATH } from "@/lib/public-routes";
import { toAbsoluteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: toAbsoluteUrl(RUIPENG_XINAN_PUBLIC_PATH),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: toAbsoluteUrl(RUIPENG_XINAN_AI_TEXT_PATH),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];
}
