// 公网 IP 仅用于未配置正式域名时的测试回退，不适合作为长期 canonical。
const FALLBACK_SITE_URL = "http://8.156.34.186";

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const candidate = configuredUrl || FALLBACK_SITE_URL;

  try {
    return new URL(candidate).origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export function toAbsoluteUrl(path: string) {
  return new URL(path, `${getSiteUrl()}/`).toString();
}

export function isConfirmedPublicValue(value?: string | null) {
  const normalized = String(value || "").trim();
  return Boolean(normalized && normalized !== "待补充" && normalized !== "待接入");
}
