export const RUIPENG_XINAN_PUBLIC_PATH = "/hospitals/ruipeng-xinan-referral-center";
export const RUIPENG_XINAN_AI_TEXT_PATH = "/ai/ruipeng-xinan-referral-center.txt";

const PUBLIC_PAGE_PATHS = new Set([RUIPENG_XINAN_PUBLIC_PATH]);
const PUBLIC_EXACT_PATHS = new Set([
  "/login",
  "/favicon.ico",
  "/ruipeng-logo.png",
  RUIPENG_XINAN_AI_TEXT_PATH,
  ...PUBLIC_PAGE_PATHS,
]);

export function isPublicPagePath(pathname: string) {
  return PUBLIC_PAGE_PATHS.has(pathname);
}

export function isPublicRequestPath(pathname: string) {
  return (
    PUBLIC_EXACT_PATHS.has(pathname) ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/ai/call") ||
    pathname.startsWith("/api/monitor/run")
  );
}
