import { loginAction } from "./actions";

export const dynamic = "force-dynamic";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: {
    error?: string;
    next?: string;
  };
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10">
      <section className="w-full max-w-md rounded-md border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-black text-slate-950">登录</h1>
        <p className="mt-2 text-sm font-semibold text-slate-500">请输入分配给你的账号和密码。</p>

        {searchParams?.error ? (
          <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
            账号或密码不正确，请重新输入。
          </div>
        ) : null}

        <form action={loginAction} className="mt-5 grid gap-4">
          <input type="hidden" name="next" value={searchParams?.next || "/"} />
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            账号
            <input name="username" autoComplete="username" required />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            密码
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          <button type="submit">登录</button>
        </form>
      </section>
    </main>
  );
}
