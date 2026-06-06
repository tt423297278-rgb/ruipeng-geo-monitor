# 瑞鹏宠物医院 AI 平台曝光监测 MVP

结论：这是瑞鹏 AI GEO 曝光监测后台，用于批量关键词、生成用户问题、结合项目资料和可选联网搜索调用多模型、保存证据与回答并计算品牌曝光分。

## 项目目录

```txt
prisma/schema.prisma        数据库表结构
src/app                     Next.js 页面与 Server Actions
src/components              后台布局与通用 UI
src/lib/core                可测试核心规则：问题生成、曝光检测
src/lib/ai-providers        DeepSeek、Kimi、豆包 Provider 调用层
src/lib/services            监测运行服务
tests                       核心逻辑测试
public                      品牌 Logo 等静态资源
```

## 运行步骤

```bash
copy .env.example .env
npm install
npm run db:generate
npm run db:deploy
npm run dev
```

打开 `http://localhost:3000`。

## 数据库

当前项目统一使用 PostgreSQL。开发和生产环境都需要通过服务端 `.env` 或 `.env.local` 配置 `DATABASE_URL`，并使用 Prisma migration 管理表结构。

## MVP 范围

- 本地后台，无复杂登录。
- 支持创建监测项目。
- 支持批量粘贴关键词。
- 每个关键词生成 3-5 个用户问题。
- 预置 DeepSeek、Kimi、豆包 Provider 配置。
- 手动运行监测，保存模型回答和失败原因。
- 支持为每个项目维护 Project Knowledge，并在模型调用前注入确认过的品牌资料。
- 可配置 Web Search Provider；未配置搜索 Key 时明确降级为“仅项目资料增强”。
- 保存搜索资料、完整 Prompt、原始模型响应和资料关键词命中情况。
- 检测品牌名、官网、电话、地址、竞品和曝光分。
- 看板展示关键词数、问题数、调用次数、品牌出现率、平均曝光分、模型对比和最近 10 条回答。
