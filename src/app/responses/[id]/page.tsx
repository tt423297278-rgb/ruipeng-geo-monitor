import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

const positionLabel: Record<string, string> = {
  NONE: "未出现",
  EARLY: "前 30%",
  MIDDLE: "中间",
  LATE: "后 30%",
};

export const dynamic = "force-dynamic";

export default async function ResponseDetailPage({ params }: { params: { id: string } }) {
  const response = await prisma.aiResponse.findUnique({
    where: { id: params.id },
    include: {
      project: true,
      keyword: true,
      question: true,
      exposureCheck: true,
    },
  });

  if (!response) {
    notFound();
  }

  const check = response.exposureCheck;

  return (
    <>
      <PageHeader
        title="AI 回答详情"
        description="查看单次模型调用的完整问题、完整回答、调用状态和曝光检测结果。"
      />

      <div className="mb-5 flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-md bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-ruipeng-pale hover:text-ruipeng-blue"
        >
          返回首页
        </Link>
        <Link
          href="/responses"
          className="rounded-md bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-ruipeng-pale hover:text-ruipeng-blue"
        >
          返回回答记录
        </Link>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard label="项目" value={response.project.name} />
        <InfoCard label="关键词" value={response.keyword.text} />
        <InfoCard label="模型" value={`${response.providerName}${response.modelName ? ` / ${response.modelName}` : ""}`} />
        <InfoCard label="调用时间" value={response.calledAt.toLocaleString("zh-CN")} />
      </section>

      <section className="mt-6 rounded-md border border-slate-200 bg-white p-5">
        <h2 className="mb-3 text-base font-black text-slate-900">用户问题</h2>
        <p className="rounded-md bg-slate-50 p-4 text-sm font-semibold leading-7 text-slate-800">
          {response.question.question}
        </p>
      </section>

      <section className="mt-6 rounded-md border border-slate-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-base font-black text-slate-900">完整回答</h2>
          <span
            className={[
              "rounded-md px-2 py-1 text-xs font-black",
              response.success ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700",
            ].join(" ")}
          >
            {response.success ? "成功" : "失败"}
          </span>
        </div>
        <div className="whitespace-pre-wrap rounded-md border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-900">
          {response.success ? response.fullAnswer || "模型未返回回答内容" : response.failureReason || "未记录失败原因"}
        </div>
      </section>

      <section className="mt-6 rounded-md border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-base font-black text-slate-900">曝光检测</h2>
        {!check ? (
          <EmptyState text="这条回答还没有曝光检测结果" />
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Metric label="品牌名" value={check.brandMentioned ? `是（${check.brandMentionCount} 次）` : "否"} />
            <Metric label="官网" value={check.websiteMentioned ? "是" : "否"} />
            <Metric label="电话" value={check.phoneMentioned ? "是" : "否"} />
            <Metric label="地址" value={check.addressMentioned ? "是" : "否"} />
            <Metric label="品牌位置" value={positionLabel[check.brandPosition] || check.brandPosition} />
            <Metric label="竞品" value={check.competitorMentioned ? "是" : "否"} />
            <Metric label="命中竞品" value={check.matchedCompetitors} />
            <Metric label="曝光分" value={`${check.score} 分`} highlight />
          </div>
        )}
      </section>
    </>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-2 break-words text-sm font-black text-slate-900">{value || "-"}</p>
    </div>
  );
}

function Metric({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className={["mt-2 break-words text-sm font-black", highlight ? "text-ruipeng-blue" : "text-slate-900"].join(" ")}>
        {value || "-"}
      </p>
    </div>
  );
}
