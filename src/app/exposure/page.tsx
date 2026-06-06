import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/prisma";

const positionLabel: Record<string, string> = {
  NONE: "未出现",
  EARLY: "前 30%",
  MIDDLE: "中间",
  LATE: "后 30%",
};

export const dynamic = "force-dynamic";

export default async function ExposurePage() {
  const checks = await prisma.exposureCheck.findMany({
    take: 200,
    orderBy: { checkedAt: "desc" },
    include: {
      response: {
        include: { project: true, keyword: true, question: true },
      },
    },
  });

  return (
    <>
      <PageHeader
        title="曝光检测结果"
        description="按品牌名、官网、电话、地址、竞品和出现位置计算 0-100 的简单曝光分。"
      />

      <section className="rounded-md border border-slate-200 bg-white p-5">
        {checks.length === 0 ? (
          <EmptyState text="暂无曝光检测结果" />
        ) : (
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>项目</th>
                  <th>模型</th>
                  <th>关键词</th>
                  <th>品牌</th>
                  <th>官网</th>
                  <th>电话</th>
                  <th>地址</th>
                  <th>竞品</th>
                  <th>命中竞品</th>
                  <th>位置</th>
                  <th>分数</th>
                </tr>
              </thead>
              <tbody>
                {checks.map((item) => (
                  <tr key={item.id}>
                    <td>{item.response.project.name}</td>
                    <td>{item.response.providerName}</td>
                    <td>{item.response.keyword.text}</td>
                    <td>{item.brandMentioned ? `是（${item.brandMentionCount}）` : "否"}</td>
                    <td>{item.websiteMentioned ? "是" : "否"}</td>
                    <td>{item.phoneMentioned ? "是" : "否"}</td>
                    <td>{item.addressMentioned ? "是" : "否"}</td>
                    <td>{item.competitorMentioned ? "是" : "否"}</td>
                    <td>{item.matchedCompetitors}</td>
                    <td>{positionLabel[item.brandPosition] || item.brandPosition}</td>
                    <td>
                      <span className="font-black text-ruipeng-blue">{item.score}</span>
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
