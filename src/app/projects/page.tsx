import { PageHeader } from "@/components/page-header";
import { createProjectAction } from "@/app/actions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { keywords: true, questions: true, responses: true } } },
  });

  return (
    <>
      <PageHeader
        title="项目管理"
        description="第一版先支持本地创建单医院监测项目；后续可扩展成多租户、多医院、多角色后台。"
      />

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <form action={createProjectAction} className="rounded-md border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-base font-black">创建监测项目</h2>
          <div className="grid gap-4">
            <label className="text-sm font-semibold">
              项目名称
              <input name="name" placeholder="瑞鹏宠物医院重庆转诊中心" required />
            </label>
            <label className="text-sm font-semibold">
              品牌名称
              <input name="brandName" placeholder="瑞鹏宠物医院" required />
            </label>
            <label className="text-sm font-semibold">
              官网
              <input name="officialWebsite" placeholder="https://..." />
            </label>
            <label className="text-sm font-semibold">
              电话
              <input name="phone" placeholder="400-..." />
            </label>
            <label className="text-sm font-semibold">
              地址
              <input name="address" placeholder="重庆市..." />
            </label>
            <label className="text-sm font-semibold">
              竞品品牌名，可用逗号或换行分隔
              <textarea name="competitorNames" rows={4} placeholder="竞品 A&#10;竞品 B" />
            </label>
            <button type="submit">创建项目</button>
          </div>
        </form>

        <div className="rounded-md border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-base font-black">已有项目</h2>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>项目</th>
                  <th>品牌</th>
                  <th>关键词</th>
                  <th>问题</th>
                  <th>调用</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.name}</td>
                    <td>{project.brandName}</td>
                    <td>{project._count.keywords}</td>
                    <td>{project._count.questions}</td>
                    <td>{project._count.responses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
