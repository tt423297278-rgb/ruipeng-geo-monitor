# Enhanced GEO Monitoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade monitoring calls to use editable project knowledge plus optional web search, while persisting evidence, prompts, raw responses, hit results, and errors.

**Architecture:** Add a one-to-one `ProjectKnowledge` model and evidence fields on `AiResponse`. A server-only enhancement service builds evidence from project knowledge and an optional configurable web search provider, then calls the existing DeepSeek/Kimi/Doubao provider layer with an evidence-grounded prompt. Admin pages edit knowledge and inspect evidence; API keys remain server-only.

**Tech Stack:** Next.js 14 App Router, Server Actions, Prisma/PostgreSQL, server-only fetch, Node test runner.

---

### Task 1: Database schema and migration

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/20260606000200_enhanced_monitoring/migration.sql`

- [ ] Add `ProjectKnowledge`, its one-to-one project relation, and evidence fields on `AiResponse`.
- [ ] Add a PostgreSQL migration that preserves existing data with safe defaults.
- [ ] Run `npx prisma generate`.

### Task 2: Evidence and prompt services

**Files:**
- Create: `src/lib/services/project-knowledge.ts`
- Create: `src/lib/services/web-search.ts`
- Create: `src/lib/services/enhanced-ai.ts`
- Modify: `src/lib/ai-providers/types.ts`
- Modify: `src/lib/ai-providers/shared.ts`
- Test: `tests/enhanced-monitoring.test.mjs`

- [ ] Build normalized knowledge evidence and optional web search results.
- [ ] Build a grounded prompt that prohibits unsupported addresses, phones, websites, and branch names.
- [ ] Extend provider calls to accept the complete server-built prompt.
- [ ] Verify prompt grounding and matched-keyword extraction with focused tests.

### Task 3: Monitoring persistence and backend route

**Files:**
- Modify: `src/lib/services/monitoring.ts`
- Create: `src/app/api/ai/call/route.ts`
- Modify: `src/middleware.ts`

- [ ] Route monitoring calls through the enhanced server-only service.
- [ ] Persist evidence, prompt, raw response, enrichment status, hit fields, and errors.
- [ ] Add an authenticated backend API route without exposing provider keys.

### Task 4: Project knowledge admin

**Files:**
- Modify: `src/app/actions.ts`
- Modify: `src/app/projects/page.tsx`
- Create: `src/app/projects/[id]/knowledge/page.tsx`

- [ ] Add knowledge upsert Server Action with cache revalidation.
- [ ] Add a project knowledge edit page for aliases, address, phone, website, map URL, introduction, specialties, and web search setting.
- [ ] Add project-list links and knowledge status.

### Task 5: Monitoring result UI

**Files:**
- Modify: `src/app/responses/page.tsx`
- Modify: `src/app/responses/[id]/page.tsx`
- Modify: `src/app/exposure/page.tsx`

- [ ] Show enhancement status and errors in the answer list.
- [ ] Show search/knowledge evidence, complete prompt, raw model response, answer, and hit results on detail pages.
- [ ] Show enhancement state in exposure results.

### Task 6: Configuration, validation, and deployment

**Files:**
- Modify: `.env.example`
- Modify: `README.md`
- Modify: `DEPLOY.md`

- [ ] Document optional `WEB_SEARCH_API_KEY` and `WEB_SEARCH_BASE_URL`.
- [ ] Run tests, Prisma validation, TypeScript check, and production build.
- [ ] Review for API-key exposure and unsupported frontend provider calls.
- [ ] Deploy migration and application to ECS, validate a knowledge-enhanced monitoring record, and push to GitHub.
