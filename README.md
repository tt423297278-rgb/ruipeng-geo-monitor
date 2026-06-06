# 瑞鹏宠物医院 AI 平台曝光监测 MVP

结论：这是第一版本地后台 MVP，用于批量关键词、生成用户问题、调用多模型、保存回答并计算品牌曝光分。

## 项目目录

```txt
prisma/schema.prisma        数据库表结构
src/app                     Next.js 页面与 Server Actions
src/components              后台布局与通用 UI
src/lib/core                可测试核心规则：问题生成、曝光检测
src/lib/providers           模型 Provider 统一接口
src/lib/services            监测运行服务
tests                       核心逻辑测试
public                      品牌 Logo 等静态资源
```

## 运行步骤

```bash
copy .env.example .env
npm install
npm run db:generate
npm run db:push
npm run dev
```

打开 `http://localhost:3000`。

## 数据库

本地默认 SQLite，便于快速开发。后续正式环境可在 `prisma/schema.prisma` 把 `provider = "sqlite"` 改为 `postgresql`，再把 `.env` 的 `DATABASE_URL` 换成 PostgreSQL 连接串。

## MVP 范围

- 本地后台，无复杂登录。
- 支持创建监测项目。
- 支持批量粘贴关键词。
- 每个关键词生成 3-5 个用户问题。
- 预置 DeepSeek、Kimi、豆包 Provider 配置。
- 手动运行监测，保存模型回答和失败原因。
- 检测品牌名、官网、电话、地址、竞品和曝光分。
- 看板展示关键词数、问题数、调用次数、品牌出现率、平均曝光分、模型对比和最近 10 条回答。
