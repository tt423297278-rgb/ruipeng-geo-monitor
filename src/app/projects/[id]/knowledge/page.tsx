import Link from "next/link";
import { notFound } from "next/navigation";
import { updateProjectKnowledgeAction } from "@/app/actions";
import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProjectKnowledgePage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { knowledge: true },
  });

  if (!project) {
    notFound();
  }

  const knowledge = project.knowledge;

  return (
    <>
      <PageHeader
        title="Project Knowledge 配置"
        description="这些经过确认的品牌资料会参与每次增强监测。未在资料或搜索结果中出现的地址、电话、门店和设备，模型会被要求不要编造。"
      />

      <div className="mb-5">
        <Link href="/projects" className="secondary inline-block rounded-md px-3 py-2 text-sm font-bold">
          返回项目管理
        </Link>
      </div>

      <form action={updateProjectKnowledgeAction} className="grid gap-5 rounded-md border border-slate-200 bg-white p-5">
        <input type="hidden" name="projectId" value={project.id} />

        <section className="grid gap-4 md:grid-cols-2">
          <KnowledgeField label="项目名称" value={project.name} readOnly />
          <KnowledgeField label="品牌名" value={project.brandName} readOnly />
          <KnowledgeField
            label="品牌别名，可用逗号或换行分隔"
            name="aliases"
            defaultValue={knowledge?.aliases || "瑞鹏西南转诊中心\n瑞鹏宠物医院黄泥磅/红土地附近门店"}
            multiline
          />
          <KnowledgeField label="确认地址" name="address" defaultValue={knowledge?.address || project.address || ""} multiline />
          <KnowledgeField label="确认电话" name="phone" defaultValue={knowledge?.phone || project.phone || ""} />
          <KnowledgeField label="确认官网" name="website" defaultValue={knowledge?.website || project.officialWebsite || ""} />
          <KnowledgeField label="地图链接" name="mapUrl" defaultValue={knowledge?.mapUrl || ""} />
          <KnowledgeField label="医院介绍" name="introduction" defaultValue={knowledge?.introduction || ""} multiline />
          <KnowledgeField label="专科能力" name="specialties" defaultValue={knowledge?.specialties || ""} multiline />
        </section>

        <label className="flex items-start gap-3 rounded-md bg-blue-50 p-4 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            name="webSearchEnabled"
            defaultChecked={knowledge?.webSearchEnabled || false}
            className="mt-1 size-4 w-auto"
          />
          <span>
            启用联网搜索。需要服务端配置 <code>WEB_SEARCH_API_KEY</code>；未配置时仍会使用项目资料增强，并记录搜索错误。
          </span>
        </label>

        <button type="submit">保存 Project Knowledge</button>
      </form>
    </>
  );
}

function KnowledgeField({
  label,
  name,
  defaultValue,
  value,
  multiline = false,
  readOnly = false,
}: {
  label: string;
  name?: string;
  defaultValue?: string;
  value?: string;
  multiline?: boolean;
  readOnly?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-700">
      {label}
      {multiline ? (
        <textarea name={name} defaultValue={defaultValue} rows={5} readOnly={readOnly} />
      ) : (
        <input name={name} defaultValue={defaultValue} value={value} readOnly={readOnly} />
      )}
    </label>
  );
}
