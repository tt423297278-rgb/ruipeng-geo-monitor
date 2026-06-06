export type AuthRole = "admin" | "customer";

export const AUTH_COOKIE_NAME = "rp_auth";
export const AUTH_MAX_AGE_SECONDS = 60 * 60 * 8;

const encoder = new TextEncoder();

function getSecret() {
  return (
    process.env.CRON_SECRET ||
    process.env.ADMIN_PASSWORD ||
    process.env.CUSTOMER_PASSWORD ||
    "development-only-auth-secret"
  );
}

function toBase64Url(bytes: ArrayBuffer) {
  const binary = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function sign(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return toBase64Url(signature);
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }

  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return result === 0;
}

export async function createAuthToken(role: AuthRole) {
  const expiresAt = Date.now() + AUTH_MAX_AGE_SECONDS * 1000;
  const payload = `${role}.${expiresAt}`;
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

export async function verifyAuthToken(token?: string | null): Promise<{ role: AuthRole } | null> {
  if (!token) {
    return null;
  }

  const [role, expiresAt, signature] = token.split(".");
  if ((role !== "admin" && role !== "customer") || !expiresAt || !signature) {
    return null;
  }

  if (Number(expiresAt) < Date.now()) {
    return null;
  }

  const expected = await sign(`${role}.${expiresAt}`);
  if (!safeEqual(signature, expected)) {
    return null;
  }

  return { role };
}

export function resolveLoginRole(username: string, password: string): AuthRole | null {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const customerUsername = process.env.CUSTOMER_USERNAME;
  const customerPassword = process.env.CUSTOMER_PASSWORD;

  if (adminUsername && adminPassword && username === adminUsername && password === adminPassword) {
    return "admin";
  }

  if (customerUsername && customerPassword && username === customerUsername && password === customerPassword) {
    return "customer";
  }

  return null;
}
