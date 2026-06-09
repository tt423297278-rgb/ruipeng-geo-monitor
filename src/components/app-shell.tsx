import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
import { RouteAwareShell } from "@/components/route-aware-shell";

export async function AppShell({ children }: { children: ReactNode }) {
  const session = await verifyAuthToken(cookies().get(AUTH_COOKIE_NAME)?.value);

  if (!session) {
    return <>{children}</>;
  }

  return <RouteAwareShell role={session.role}>{children}</RouteAwareShell>;
}
