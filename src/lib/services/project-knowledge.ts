export type KnowledgeSource = {
  title: string;
  url: string;
  content: string;
  sourceType: "project_knowledge" | "web_search";
};

export type ProjectKnowledgeInput = {
  projectName: string;
  brandName: string;
  officialWebsite?: string | null;
  phone?: string | null;
  address?: string | null;
  knowledge?: {
    aliases: string;
    address: string;
    phone: string;
    website: string;
    mapUrl: string;
    introduction: string;
    specialties: string;
    webSearchEnabled: boolean;
  } | null;
};

export function splitKnowledgeTerms(value?: string | null) {
  return String(value || "")
    .split(/[,，、\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function buildProjectKnowledgeSources(project: ProjectKnowledgeInput): KnowledgeSource[] {
  const knowledge = project.knowledge;
  const fields = [
    `项目名称：${project.projectName}`,
    `品牌名：${project.brandName}`,
    `别名：${splitKnowledgeTerms(knowledge?.aliases).join("、") || "未配置"}`,
    `地址：${knowledge?.address || project.address || "未配置"}`,
    `电话：${knowledge?.phone || project.phone || "未配置"}`,
    `官网：${knowledge?.website || project.officialWebsite || "未配置"}`,
    `地图链接：${knowledge?.mapUrl || "未配置"}`,
    `医院介绍：${knowledge?.introduction || "未配置"}`,
    `专科能力：${knowledge?.specialties || "未配置"}`,
  ];

  return [
    {
      title: `${project.projectName}官方项目资料`,
      url: knowledge?.website || project.officialWebsite || knowledge?.mapUrl || "",
      content: fields.join("\n"),
      sourceType: "project_knowledge",
    },
  ];
}

export function buildTrackedKnowledgeTerms(project: ProjectKnowledgeInput) {
  return Array.from(
    new Set(
      [
        project.brandName,
        ...splitKnowledgeTerms(project.knowledge?.aliases),
        project.knowledge?.address || project.address,
        project.knowledge?.phone || project.phone,
        project.knowledge?.website || project.officialWebsite,
      ].filter((item): item is string => Boolean(item?.trim())),
    ),
  );
}
