import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("登录 Cookie 根据公网协议决定是否启用 Secure", async () => {
  const auth = await readFile("src/lib/auth.ts", "utf8");
  const loginAction = await readFile("src/app/login/actions.ts", "utf8");

  assert.match(auth, /NEXT_PUBLIC_APP_URL/);
  assert.match(auth, /protocol === "https:"/);
  assert.match(loginAction, /secure: shouldUseSecureAuthCookie\(\)/);
});
