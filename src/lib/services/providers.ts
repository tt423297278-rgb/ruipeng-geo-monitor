import { prisma } from "@/lib/prisma";
import { DEFAULT_PROVIDERS } from "@/lib/providers/registry";

export async function ensureDefaultProviders() {
  for (const provider of DEFAULT_PROVIDERS) {
    await prisma.aiProvider.upsert({
      where: { name: provider.name },
      update: {
        displayName: provider.displayName,
        baseUrlEnv: provider.baseUrlEnv,
        apiKeyEnv: provider.apiKeyEnv,
        modelEnv: provider.modelEnv,
        enabled: provider.enabled,
      },
      create: provider,
    });
  }
}
