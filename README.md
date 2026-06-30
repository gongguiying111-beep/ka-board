# KA Board

个人 KA 项目看板。基于 Next.js + Supabase + Vercel。

## 技术栈

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Supabase (数据库)
- Vercel (部署)

## 本地运行

```bash
# 1. 安装依赖
npm install

# 2. 复制环境变量
cp .env.example .env.local

# 3. 编辑 .env.local，填入 Supabase 项目信息
#    NEXT_PUBLIC_SUPABASE_URL=你的supabase地址
#    NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon key

# 4. 启动开发服务器
npm run dev

# 5. 打开浏览器
open http://localhost:3000
```

## Supabase 初始化

1. 在 [supabase.com](https://supabase.com) 创建新项目
2. 进入 SQL Editor
3. 复制 `schema.sql` 全部内容并执行
4. 在项目 Settings → API 中获取 `URL` 和 `anon public key`
5. 填入 `.env.local`

## 数据库结构

只有一张表 `projects`：

| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| name | text | 客户名称 |
| stage | text | 项目阶段 |
| next_action | text | 下一步行动 |
| health | text | green / yellow / red |
| notes | text | 备注（模板格式） |
| created_at | timestamptz | 创建时间 |
| updated_at | timestamptz | 更新时间（自动更新） |

## 项目阶段

固定的 7 个阶段（定义在 `src/lib/stages.ts`）：

线索 → 已联系 → 需求确认 → 方案设计 → POC → 商务谈判 → 成交

## Vercel 部署

1. Push 代码到 GitHub
2. 在 [vercel.com](https://vercel.com) 导入仓库
3. 设置环境变量 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 部署
