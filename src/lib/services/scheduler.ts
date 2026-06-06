import cron from "node-cron";
import { prisma } from "@/lib/prisma";
import { runProjectMonitoring } from "./monitoring";

/**
 * 定时任务预留入口。
 * MVP 阶段不在 Next.js 进程里自动启动，避免本地热更新重复注册任务。
 * 后续可在独立 worker 或服务端部署入口中调用 startScheduler。
 */
export function startScheduler() {
  cron.schedule("0 9 * * *", async () => {
    const tasks = await prisma.scheduledTask.findMany({
      where: { enabled: true },
      include: { project: true },
    });

    for (const task of tasks) {
      await runProjectMonitoring(task.projectId);
      await prisma.scheduledTask.update({
        where: { id: task.id },
        data: { lastRunAt: new Date() },
      });
    }
  });
}
