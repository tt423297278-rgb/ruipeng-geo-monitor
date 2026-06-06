import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

const PUBLIC_PATHS = ["/login", "/favicon.ico", "/ruipeng-logo.png"];

function isPublicPath(pathname: string) {
  return (
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/ai/call") ||
    pathname.startsWith("/api/monitor/run")
  );
}

function appUrl(pathname: string, requestUrl: string) {
  const origin = process.env.NEXT_PUBLIC_APP_URL || requestUrl;
  return new URL(pathname, origin);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await verifyAuthToken(request.cookies.get(AUTH_COOKIE_NAME)?.value);

  if (pathname === "/login" && session) {
    return NextResponse.redirect(appUrl("/", request.url));
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = appUrl("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 客户账号只允许访问首页，避免看到项目管理、关键词、回答详情等后台能力。
  if (session.role === "customer" && pathname !== "/") {
    return NextResponse.redirect(appUrl("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\.).*)"],
};
