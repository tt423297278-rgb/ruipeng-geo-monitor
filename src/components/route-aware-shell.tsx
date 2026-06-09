"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { AuthRole } from "@/lib/auth";
import { logoutAction } from "@/app/login/actions";
import { isPublicPagePath } from "@/lib/public-routes";

const navItems = [
  { href: "/", label: "首页看板" },
  { href: "/projects", label: "项目管理" },
  { href: "/keywords", label: "关键词管理" },
  { href: "/questions", label: "问题生成" },
  { href: "/model-test", label: "模型测试" },
  { href: "/responses", label: "AI 回答记录" },
  { href: "/exposure", label: "曝光检测结果" },
];

export function RouteAwareShell({ children, role }: { children: ReactNode; role: AuthRole }) {
  const pathname = usePathname();

  if (isPublicPagePath(pathname)) {
    return <>{children}</>;
  }

  const visibleNavItems = role === "customer" ? navItems.slice(0, 1) : navItems;

  return (
    <div className="min-h-screen lg:flex">
      <aside className="border-r border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:w-64">
        <div className="border-b border-slate-200 px-5 py-5">
          <Image
            src="/ruipeng-logo.png"
            width={220}
            height={76}
            alt="瑞鹏宠物医院"
            className="h-auto w-full"
            priority
          />
          <p className="mt-3 text-sm font-semibold text-ruipeng-dark">AI 平台曝光监测 MVP</p>
        </div>
        <nav className="grid gap-1 p-3">
          {visibleNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-ruipeng-pale hover:text-ruipeng-blue"
            >
              {item.label}
            </Link>
          ))}
          <form action={logoutAction} className="mt-3 border-t border-slate-100 pt-3">
            <button type="submit" className="secondary w-full text-left">
              退出登录
            </button>
          </form>
        </nav>
      </aside>
      <main className="min-h-screen flex-1 px-5 py-6 lg:ml-64 lg:px-8">{children}</main>
    </div>
  );
}
