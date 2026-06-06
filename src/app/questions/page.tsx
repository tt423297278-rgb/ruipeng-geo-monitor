import { generateQuestionsAction } from "@/app/actions";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function QuestionsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      questions: {
        include: { keyword: true },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { keywords: true } },
    },
  });

  return (
    <>
      <PageHeader
        title="问题生成"
        description="每个关键词会生成 3-5 个用户搜索问题，第一版用模板生成，后续可接入 LLM 生成。"
      />

      {projects.length === 0 ? (
        <EmptyState text="请先创建项目并添加关键词" />
      ) : (
        <div className="grid gap-6">
          {projects.map((project) => (
            <section key={project.id} className="rounded-md border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-black">{project.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">关键词：{project._count.keywords} 个</p>
                </div>
                <form action={generateQuestionsAction}>
                  <input type="hidden" name="projectId" value={project.id} />
                  <button type="submit" className="secondary">生成缺失问题</button>
                </form>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table>
                  <thead>
                    <tr>
                      <th>关键词</th>
                      <th>生成问题</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.questions.map((item) => (
                      <tr key={item.id}>
                        <td>{item.keyword.text}</td>
                        <td>{item.question}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
