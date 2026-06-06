"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { generateMissingQuestions, runProjectMonitoring } from "@/lib/services/monitoring";

function requiredText(formData: FormData, key: string) {
  const value = String(formData.get(key) || "").trim();
  if (!value) throw new Error(`缺少必填字段：${key}`);
  return value;
}

export async function createProjectAction(formData: FormData) {
  await prisma.project.create({
    data: {
      name: requiredText(formData, "name"),
      brandName: requiredText(formData, "brandName"),
      officialWebsite: String(formData.get("officialWebsite") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      address: String(formData.get("address") || "").trim(),
      competitorNames: String(formData.get("competitorNames") || "").trim(),
    },
  });

  revalidatePath("/");
  revalidatePath("/projects");
}

export async function updateProjectKnowledgeAction(formData: FormData) {
  const projectId = requiredText(formData, "projectId");

  await prisma.projectKnowledge.upsert({
    where: { projectId },
    update: {
      aliases: String(formData.get("aliases") || "").trim(),
      address: String(formData.get("address") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      website: String(formData.get("website") || "").trim(),
      mapUrl: String(formData.get("mapUrl") || "").trim(),
      introduction: String(formData.get("introduction") || "").trim(),
      specialties: String(formData.get("specialties") || "").trim(),
      webSearchEnabled: formData.get("webSearchEnabled") === "on",
    },
    create: {
      projectId,
      aliases: String(formData.get("aliases") || "").trim(),
      address: String(formData.get("address") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      website: String(formData.get("website") || "").trim(),
      mapUrl: String(formData.get("mapUrl") || "").trim(),
      introduction: String(formData.get("introduction") || "").trim(),
      specialties: String(formData.get("specialties") || "").trim(),
      webSearchEnabled: formData.get("webSearchEnabled") === "on",
    },
  });

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}/knowledge`);
}

export async function addKeywordsAction(formData: FormData) {
  const projectId = requiredText(formData, "projectId");
  const text = requiredText(formData, "keywords");
  const keywords = Array.from(
    new Set(
      text
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );

  for (const keyword of keywords) {
    await prisma.keyword.upsert({
      where: { projectId_text: { projectId, text: keyword } },
      update: {},
      create: { projectId, text: keyword },
    });
  }

  revalidatePath("/");
  revalidatePath("/keywords");
  revalidatePath("/questions");
}

export async function deleteKeywordAction(formData: FormData) {
  const keywordId = requiredText(formData, "keywordId");

  // Keyword 与问题、回答、曝光检测是级联关系；删除关键词会同步清理关联监测数据。
  await prisma.keyword.delete({
    where: { id: keywordId },
  });

  revalidatePath("/");
  revalidatePath("/keywords");
  revalidatePath("/questions");
  revalidatePath("/responses");
  revalidatePath("/exposure");
}

export async function generateQuestionsAction(formData: FormData) {
  const projectId = requiredText(formData, "projectId");
  await generateMissingQuestions(projectId);

  revalidatePath("/");
  revalidatePath("/questions");
}

export async function runMonitoringAction(formData: FormData) {
  const projectId = requiredText(formData, "projectId");
  await runProjectMonitoring(projectId);

  revalidatePath("/");
  revalidatePath("/responses");
  revalidatePath("/exposure");
}
