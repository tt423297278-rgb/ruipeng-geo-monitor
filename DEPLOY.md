# 瑞鹏 AI 曝光监测部署说明

## 1. 本地如何运行

1. 安装依赖：

```bash
npm install
```

2. 准备环境变量：

```bash
cp .env.example .env.local
```

把 `.env.local` 里的 `DATABASE_URL`、后台账号密码和各模型 API Key 改成自己的值。不要把真实 `.env.local` 提交到代码仓库。

3. 本地数据库建议使用 PostgreSQL。创建数据库后执行：

```bash
npx prisma generate
npx prisma migrate deploy
```

4. 启动开发服务：

```bash
npm run dev
```

默认访问：

```text
http://localhost:3000
```

## 2. 如何创建线上数据库

推荐使用托管 PostgreSQL，例如：

- Vercel Postgres / Neon
- Supabase Postgres
- Railway Postgres
- Render Postgres

创建数据库后复制连接串，格式通常类似：

```text
postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public
```

把它配置到部署平台环境变量：

```text
DATABASE_URL=postgresql://...
```

## 3. 如何配置环境变量

生产环境至少配置：

```text
DATABASE_URL=
DEEPSEEK_API_KEY=
KIMI_API_KEY=
DOUBAO_API_KEY=
NEXT_PUBLIC_APP_URL=
CRON_SECRET=
ADMIN_USERNAME=
ADMIN_PASSWORD=
CUSTOMER_USERNAME=
CUSTOMER_PASSWORD=
CUSTOMER_PROJECT_NAME=
```

可选模型配置：

```text
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
KIMI_BASE_URL=https://api.moonshot.cn/v1
KIMI_MODEL=moonshot-v1-8k
DOUBAO_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
DOUBAO_MODEL=你的火山方舟 endpoint id
```

账号说明：

- `ADMIN_USERNAME` / `ADMIN_PASSWORD`：管理员账号，可访问全部后台。
- `CUSTOMER_USERNAME` / `CUSTOMER_PASSWORD`：客户账号，只能访问首页看板。
- `CUSTOMER_PROJECT_NAME`：客户首页只看这个项目名称的数据，例如 `瑞鹏宠物医院西南转诊中心`。这个值必须和项目管理页里的项目名称完全一致。

## 4. 如何部署到 Vercel

1. 把项目推送到 GitHub / GitLab / Bitbucket。
2. 登录 Vercel，创建新项目并导入代码仓库。
3. Framework 选择 Next.js。
4. Build Command 使用：

```bash
npm run build
```

5. Output Directory 使用：

```text
.next
```

6. Node.js 版本要求：

```text
Node.js 20 或 22
```

7. 在 Vercel Project Settings -> Environment Variables 中配置第 3 节所有变量。
8. 首次上线前先执行数据库迁移，见下一节。
9. 部署完成后，把 `NEXT_PUBLIC_APP_URL` 改成正式域名，例如：

```text
https://your-domain.com
```

## 5. 如何执行 Prisma migration

生产环境使用：

```bash
npx prisma migrate deploy
npx prisma generate
```

不要在生产环境使用：

```bash
npx prisma migrate dev
```

推荐流程：

1. 先在本地或预发环境确认 migration。
2. 在线上数据库执行 `npx prisma migrate deploy`。
3. 再触发 Vercel 部署。

如果使用 Vercel CLI，可以先拉取线上环境变量：

```bash
vercel env pull .env.local
```

再执行：

```bash
npx prisma migrate deploy
```

## 6. 如何绑定域名

1. 在 Vercel 项目中打开 Settings -> Domains。
2. 添加客户域名，例如：

```text
geo.example.com
```

3. 按 Vercel 提示到域名服务商添加 DNS 记录。
4. 等待证书签发完成。
5. 把 `NEXT_PUBLIC_APP_URL` 更新为最终域名。

## 7. 访问权限

当前版本是最小账号密码保护：

- 未登录访问后台会跳转到 `/login`。
- 管理员账号可以访问全部页面。
- 客户账号只能访问首页看板。
- 客户首页只展示 `CUSTOMER_PROJECT_NAME` 对应项目的数据。

这不是完整 SaaS 多租户权限系统。正式商业化前建议升级为数据库用户表、密码哈希、会话失效、操作审计和多租户隔离。

## 8. 定时任务

当前版本保留手动运行入口：

```text
AI 回答记录 -> 手动运行监测
```

API 路由 `/api/monitor/run` 已加 `CRON_SECRET` 保护，只接受：

```text
Authorization: Bearer <CRON_SECRET>
```

第一版不建议立即打开自动定时任务。等线上模型调用、数据库写入和费用确认稳定后，再接 Vercel Cron 或其他任务平台。

## 9. 常见错误

### 1. Prisma 提示无法连接数据库

检查：

- `DATABASE_URL` 是否是 PostgreSQL 连接串。
- 数据库是否允许 Vercel 访问。
- 数据库是否开启 SSL；部分平台连接串需要 `sslmode=require`。

### 2. 构建时 Prisma Client 不存在

确认 `package.json` 的 build 命令包含：

```bash
prisma generate && next build
```

### 3. 登录后客户看不到数据

检查：

- `CUSTOMER_PROJECT_NAME` 是否和项目管理页项目名称完全一致。
- 线上数据库是否已有这个项目。
- 是否已经录入关键词、生成问题并运行监测。

### 4. AI 调用失败

检查：

- 对应模型 API Key 是否配置。
- 模型名或豆包 endpoint id 是否正确。
- 线上服务器是否能访问对应模型 API。

### 5. 手动运行监测没有结果

检查：

- 项目是否有关键词。
- 是否已经在问题生成页生成问题。
- 模型 API Key 是否可用。
- 数据库是否能写入 `ai_responses` 和 `exposure_checks`。

## 10. 上线前检查清单

- [ ] `npm install` 成功
- [ ] `npm run lint` 成功
- [ ] `npm run build` 成功
- [ ] `DATABASE_URL` 已配置为线上 PostgreSQL
- [ ] `npx prisma migrate deploy` 已在线上数据库执行
- [ ] `npx prisma generate` 已执行
- [ ] `DEEPSEEK_API_KEY` / `KIMI_API_KEY` / `DOUBAO_API_KEY` 至少配置一个可用
- [ ] `NEXT_PUBLIC_APP_URL` 已配置为线上访问地址
- [ ] `CRON_SECRET` 已配置为随机强密钥
- [ ] `ADMIN_USERNAME` / `ADMIN_PASSWORD` 已配置
- [ ] `CUSTOMER_USERNAME` / `CUSTOMER_PASSWORD` 已配置
- [ ] `CUSTOMER_PROJECT_NAME` 已配置为客户可见项目
- [ ] 管理员能登录并访问项目、关键词、问题、回答和曝光页
- [ ] 客户能登录且只能看到首页
- [ ] 首页能显示瑞鹏宠物医院西南转诊中心项目数据
- [ ] 能成功保存一条 AI 回答
- [ ] 能成功生成一条曝光检测结果
- [ ] 线上页面刷新不会 404
- [ ] 绑定域名后 HTTPS 正常
