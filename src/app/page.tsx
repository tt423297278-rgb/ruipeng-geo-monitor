import { EmptyState } from "@/components/empty-state";
import { HeroCarousel } from "@/components/hero-carousel";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { getDashboardData } from "@/lib/services/dashboard";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
import Link from "next/link";
import { cookies } from "next/headers";
import type { ReactNode } from "react";

type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await verifyAuthToken(cookies().get(AUTH_COOKIE_NAME)?.value);
  const isCustomer = session?.role === "customer";
  let data: DashboardData;

  try {
    data = await getDashboardData({
      projectName: isCustomer ? process.env.CUSTOMER_PROJECT_NAME : undefined,
    });
  } catch (error) {
    return <DatabaseUnavailable error={error} />;
  }

  return (
    <>
      <PageHeader
        title="首页数据看板"
        description="汇总关键词、问题、模型调用和曝光检测结果，用于快速判断瑞鹏品牌在 AI 回答中的可见度。"
      />

      <HeroCarousel />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="总关键词数" value={data.keywordCount} />
        <StatCard label="总问题数" value={data.questionCount} />
        <StatCard label="总调用次数" value={data.responseCount} />
        <StatCard label="品牌出现率" value={`${data.brandMentionRate}%`} />
        <StatCard label="平均曝光分" value={data.averageScore} />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[380px_1fr]">
        <div className="rounded-md border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-base font-black text-slate-900">各模型曝光对比</h2>
          {data.modelComparison.length === 0 ? (
            <EmptyState text="暂无模型调用结果" />
          ) : (
            <div className="grid gap-3">
              {data.modelComparison.map((item) => (
                <div key={item.providerName}>
                  <div className="mb-1 flex justify-between text-sm font-semibold">
                    <span>{item.providerName}</span>
                    <span>{item.averageScore} 分</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-ruipeng-blue"
                      style={{ width: `${item.averageScore}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">样本数：{item.count}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-base font-black text-slate-900">最近 10 条 AI 回答记录</h2>
          {data.recentResponses.length === 0 ? (
            <EmptyState text="暂无回答记录，请先创建项目、录入关键词并运行监测" />
          ) : (
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>项目</th>
                    <th>模型</th>
                    <th>问题</th>
                    <th>状态</th>
                    <th>曝光分</th>
                    {!isCustomer ? <th>操作</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {data.recentResponses.map((item) => (
                    <tr key={item.id}>
                      <td>{item.project.name}</td>
                      <td>{item.providerName}</td>
                      <td>{item.question.question}</td>
                      <td>{item.success ? "成功" : "失败"}</td>
                      <td>{item.exposureCheck?.score ?? "-"}</td>
                      {!isCustomer ? (
                        <td>
                          <Link
                            href={`/responses/${item.id}`}
                            className="text-sm font-black text-ruipeng-blue hover:text-ruipeng-dark"
                          >
                            查看
                          </Link>
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <DashboardCard title="TOP 热词榜">
          <HotKeywordRanking items={data.hotKeywords} />
        </DashboardCard>

        <DashboardCard title="指定词条收录榜">
          <TrackedTermRanking items={data.trackedTerms} />
        </DashboardCard>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        <DashboardCard
          title="近期曝光趋势"
          action={<span className="text-xs font-bold text-ruipeng-blue">日 / 周 / 月</span>}
        >
          <TrendChart points={data.trendPoints} />
        </DashboardCard>

        <DashboardCard title="AI 回答词云">
          <WordCloud terms={data.wordCloudTerms} />
        </DashboardCard>
      </section>
    </>
  );
}

function DatabaseUnavailable({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : "数据库连接失败";

  return (
    <>
      <PageHeader
        title="首页数据看板"
        description="当前账号已登录，但数据库还没有连接成功。"
      />
      <section className="rounded-md border border-amber-200 bg-white p-5">
        <h2 className="text-base font-black text-amber-700">数据库未连接</h2>
        <p className="mt-3 text-sm font-semibold leading-7 text-slate-700">
          当前本地环境的 <code>DATABASE_URL</code> 还是 PostgreSQL 占位地址，或者对应数据库没有启动。请在
          <code>.env.local</code> 里填入真实 PostgreSQL 连接串，然后执行数据库迁移并重启服务。
        </p>
        <div className="mt-4 rounded-md bg-slate-50 p-4 text-sm leading-7 text-slate-700">
          <p className="font-black">需要执行：</p>
          <pre className="mt-2 whitespace-pre-wrap">
{`npx prisma migrate deploy
npx prisma generate
npm run dev`}
          </pre>
        </div>
        <p className="mt-4 break-words text-xs font-semibold text-slate-500">当前错误：{message}</p>
      </section>
    </>
  );
}

function DashboardCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-black text-slate-900">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function HotKeywordRanking({ items }: { items: DashboardData["hotKeywords"] }) {
  if (items.length === 0) {
    return <EmptyState text="暂无关键词数据" />;
  }

  const medals = ["1", "2", "3"];

  return (
    <div className="grid gap-3">
      {items.map((item, index) => (
        <div key={item.id} className="grid grid-cols-[28px_1fr_92px] items-center gap-3">
          <span
            className={[
              "flex size-6 items-center justify-center rounded-full text-xs font-black",
              index < 3 ? "bg-blue-50 text-ruipeng-blue" : "bg-slate-100 text-slate-500",
            ].join(" ")}
          >
            {medals[index] || index + 1}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900">{item.text}</p>
            <p className="mt-1 text-xs text-slate-500">
              问题 {item.questionCount} 个 · 调用 {item.callCount} 次 · 品牌出现 {item.brandMentionRate}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-ruipeng-blue">{item.averageScore}</p>
            <p className="text-xs text-slate-500">曝光分</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function TrackedTermRanking({ items }: { items: DashboardData["trackedTerms"] }) {
  if (items.length === 0) {
    return <EmptyState text="暂无指定词条检测结果" />;
  }

  const maxHits = Math.max(...items.map((item) => item.hits), 1);

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div key={item.id} className="grid grid-cols-[86px_1fr_42px] items-center gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-500">{item.label}</p>
            <p className="truncate text-sm font-bold text-slate-900">{item.term}</p>
          </div>
          <div>
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-ruipeng-blue to-cyan-400"
                style={{ width: `${Math.max(6, (item.hits / maxHits) * 100)}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              收录率 {item.rate}% · 样本 {item.total}
            </p>
          </div>
          <p className="text-right text-sm font-black text-slate-700">{item.hits}</p>
        </div>
      ))}
    </div>
  );
}

function TrendChart({ points }: { points: DashboardData["trendPoints"] }) {
  if (points.length === 0) {
    return <EmptyState text="暂无曝光趋势数据" />;
  }

  const width = 640;
  const height = 240;
  const chartLeft = 38;
  const chartRight = 612;
  const chartTop = 24;
  const chartBottom = 196;
  const chartHeight = chartBottom - chartTop;
  const maxCalls = Math.max(...points.map((item) => item.calls), 1);
  const chartWidth = chartRight - chartLeft;
  const step = points.length <= 1 ? 0 : chartWidth / (points.length - 1);
  const linePoints = points.map((item, index) => {
    const x = points.length <= 1 ? width / 2 : chartLeft + index * step;
    const y = chartBottom - (item.averageScore / 100) * chartHeight;
    return { ...item, x, y };
  });
  const path = linePoints.map((item) => `${item.x},${item.y}`).join(" ");

  return (
    <div className="overflow-hidden rounded-md bg-[#eef4ff] px-3 py-4">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="近期曝光趋势图" className="h-72 w-full">
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = chartBottom - (tick / 100) * chartHeight;
          return (
            <g key={tick}>
              <line x1="34" x2={width - 18} y1={y} y2={y} stroke="#c7d6ee" strokeWidth="1" />
              <text x="8" y={y + 4} fill="#58708f" fontSize="12" fontWeight="700">
                {tick}
              </text>
            </g>
          );
        })}

        {linePoints.map((item) => {
          const barHeight = Math.max(4, (item.calls / maxCalls) * 88);
          return (
            <rect
              key={`${item.dateKey}-bar`}
              x={item.x - 5}
              y={chartBottom - barHeight}
              width="10"
              height={barHeight}
              rx="3"
              fill="#8fb6ff"
              opacity="0.55"
            />
          );
        })}

        <polyline
          points={path}
          fill="none"
          stroke="#16d7c9"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />

        {linePoints.map((item) => (
          <g key={item.dateKey} transform={`translate(${item.x} 0)`}>
            <circle cx="0" cy={item.y} r="5" fill="#16d7c9" stroke="#fff" strokeWidth="2" />
            <text x="0" y={item.y - 12} fill="#1f4f95" fontSize="12" fontWeight="800" textAnchor="middle">
              {item.averageScore}
            </text>
            <text x="0" y="225" fill="#58708f" fontSize="11" fontWeight="700" textAnchor="middle">
              {item.label}
            </text>
          </g>
        ))}
      </svg>

      <div className="grid gap-2 text-xs text-slate-600 md:grid-cols-3">
        <span>折线：平均曝光分</span>
        <span>浅蓝柱：调用次数</span>
        <span>样本天数：{points.length}</span>
      </div>
    </div>
  );
}

function WordCloud({ terms }: { terms: DashboardData["wordCloudTerms"] }) {
  if (terms.length === 0) {
    return <EmptyState text="暂无 AI 回答词云数据" />;
  }

  return (
    <div className="flex min-h-72 content-center items-center justify-center rounded-md bg-[#f3f6fc] p-5">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {terms.map((term) => (
          <span
            key={term.text}
            className={[
              "rounded-full px-3 py-1.5 font-black shadow-sm",
              getWordCloudClass(term.tone),
            ].join(" ")}
            style={{ fontSize: `${Math.min(22, Math.max(12, 10 + term.weight))}px` }}
          >
            {term.text}
          </span>
        ))}
      </div>
    </div>
  );
}

function getWordCloudClass(tone: DashboardData["wordCloudTerms"][number]["tone"]) {
  switch (tone) {
    case "brand":
      return "bg-ruipeng-blue text-white";
    case "competitor":
      return "bg-amber-100 text-amber-700";
    case "keyword":
      return "bg-blue-100 text-blue-700";
    case "medical":
      return "bg-cyan-100 text-cyan-700";
    default:
      return "bg-white text-slate-700";
  }
}
