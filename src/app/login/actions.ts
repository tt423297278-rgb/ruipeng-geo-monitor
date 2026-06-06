"use server";

import { AUTH_COOKIE_NAME, AUTH_MAX_AGE_SECONDS, createAuthToken, resolveLoginRole } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const nextPath = String(formData.get("next") || "/");
  const role = resolveLoginRole(username, password);

  if (!role) {
    redirect("/login?error=1");
  }

  const token = await createAuthToken(role);
  cookies().set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: AUTH_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  redirect(nextPath.startsWith("/") ? nextPath : "/");
}

export async function logoutAction() {
  cookies().delete(AUTH_COOKIE_NAME);
  redirect("/login");
}
