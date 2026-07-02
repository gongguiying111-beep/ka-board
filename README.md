# KA Board

KA 项目看板 — 个人客户关系管理与进度追踪工具。

## 技术栈

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Supabase (PostgreSQL)
- 部署：Vercel / EdgeOne Pages / Docker

## 功能

- 📋 Project Board — 7 阶段看板，拖拽管理
- 📊 Project Summary — 表格汇总视图
- 📅 Daily Overview — 每日城市概览
- 🔐 全站密码访问 + 管理员编辑模式
- 🚨 Blocker 阻塞项标记
- 📍 城市分组、跟进人分配
- 🟢🟡🔴 阶段颜色标识

## 快速开始

```bash
npm install
cp .env.example .env.local
# 编辑 .env.local 填入配置
npm run dev
# → http://localhost:3000
```

## 环境变量

| 变量名 | 说明 |
|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 |
| `ADMIN_PASSWORD` | 管理员模式密码 |
| `SITE_PASSWORD` | 网站访问密码 |

## 数据库

在 Supabase SQL Editor 中执行 `schema.sql`。

## Docker 部署

```bash
docker build -t ka-board .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  -e ADMIN_PASSWORD=your_admin_pw \
  -e SITE_PASSWORD=your_site_pw \
  ka-board
```

## Vercel 部署

1. 导入 GitHub 仓库
2. 框架自动识别 Next.js
3. Settings → Environment Variables 配置 4 个变量
4. 部署

## EdgeOne Pages 部署

1. 导入 GitHub 仓库
2. 构建设置（默认）：Framework: Next.js | Build: `npm run build` | Output: `.next` | Node: 20
3. 添加环境变量
4. 部署

## 项目结构

```
src/
├── app/           # 页面 (Board / Summary / Daily)
│   └── api/       # auth / site-auth
├── components/    # React 组件
├── lib/           # 工具 & 配置
└── types/         # TypeScript 类型
schema.sql         # 建表 SQL
Dockerfile
next.config.ts
```
