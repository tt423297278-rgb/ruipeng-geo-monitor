import { NextResponse } from "next/server";
import { runProjectMonitoring } from "@/lib/services/monitoring";

export async function POST(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization") || "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";

  if (!cronSecret || bearerToken !== cronSecret) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const body = (await request.json()) as { projectId?: string };

  if (!body.projectId) {
    return NextResponse.json({ error: "缺少 projectId" }, { status: 400 });
  }

  const result = await runProjectMonitoring(body.projectId);
  return NextResponse.json(result);
}
