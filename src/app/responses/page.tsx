import { runMonitoringAction } from "@/app/actions";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ResponsesPage() {
  const [projects, responses] = await Promise.all([
    prisma.project.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.aiResponse.findMany({
      take: 100,
      orderBy: { calledAt: "desc" },
      include: { project: true, keyword: true, question: true },
    }),
  ]);

  return (
    <>
      <PageHeader
        title="AI 回答记录"
        description="手动运行监测后，系统保存每个模型对每个问题的完整回答、调用时间、成功状态和失败原因。"
      />

      <section className="mb-6 rounded-md border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-base font-black">手动运行监测</h2>
        {projects.length === 0 ? (
          <EmptyState text="请先创建项目" />
        ) : (
          <div className="flex flex-wrap gap-3">
            {projects.map((project) => (
              <form key={project.id} action={runMonitoringAction}>
                <input type="hidden" name="projectId" value={project.id} />
                <button type="submit">运行：{project.name}</button>
              </form>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-base font-black">回答记录</h2>
        {responses.length === 0 ? (
          <EmptyState text="暂无回答记录" />
        ) : (
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>时间</th>
                  <th>项目</th>
                  <th>关键词</th>
                  <th>模型</th>
                  <th>问题</th>
                  <th>状态</th>
                  <th>增强模式</th>
                  <th>回答/失败原因</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((item) => (
                  <tr key={item.id}>
                    <td>{item.calledAt.toLocaleString("zh-CN")}</td>
                    <td>{item.project.name}</td>
                    <td>{item.keyword?.text || "手动测试"}</td>
                    <td>{item.providerName}</td>
                    <td>{item.questionText || item.question?.question || "-"}</td>
                    <td>{item.success ? "成功" : "失败"}</td>
                    <td>
                      {item.enrichmentEnabled
                        ? item.webSearchUsed
                          ? "项目资料 + 联网"
                          : "仅项目资料"
                        : "未启用"}
                      {item.enrichmentError ? <p className="mt-1 text-xs text-amber-700">{item.enrichmentError}</p> : null}
                    </td>
                    <td className="max-w-xl text-sm text-slate-600">
                      {item.success ? item.fullAnswer : item.failureReason}
                    </td>
                    <td>
                      <Link
                        href={`/responses/${item.id}`}
                        className="text-sm font-black text-ruipeng-blue hover:text-ruipeng-dark"
                      >
                        查看
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
