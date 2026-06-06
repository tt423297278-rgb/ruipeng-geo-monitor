import { addKeywordsAction, deleteKeywordAction } from "@/app/actions";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function KeywordsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { keywords: { orderBy: { createdAt: "desc" } } },
  });

  return (
    <>
      <PageHeader
        title="关键词管理"
        description="支持手动输入和批量粘贴，一行一个关键词；系统会自动去重保存。"
      />

      {projects.length === 0 ? (
        <EmptyState text="请先到项目管理页创建一个监测项目" />
      ) : (
        <div className="grid gap-6">
          {projects.map((project) => (
            <section key={project.id} className="rounded-md border border-slate-200 bg-white p-5">
              <h2 className="text-base font-black">{project.name}</h2>
              <form action={addKeywordsAction} className="mt-4 grid gap-3">
                <input type="hidden" name="projectId" value={project.id} />
                <textarea
                  name="keywords"
                  rows={6}
                  placeholder={"重庆宠物医院\n重庆动物医院\n宠物急诊医院"}
                  required
                />
                <button type="submit">保存关键词</button>
              </form>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.keywords.map((keyword) => (
                  <form
                    key={keyword.id}
                    action={deleteKeywordAction}
                    className="flex items-center gap-2 rounded-md bg-ruipeng-pale px-3 py-1 text-sm font-semibold text-ruipeng-dark"
                  >
                    <input type="hidden" name="keywordId" value={keyword.id} />
                    <span>{keyword.text}</span>
                    <button
                      type="submit"
                      className="rounded bg-transparent px-1 py-0 text-xs font-black text-slate-500 hover:bg-white hover:text-red-600"
                      title="删除关键词及关联监测数据"
                    >
                      删除
                    </button>
                  </form>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
