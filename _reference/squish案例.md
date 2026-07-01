# Squish 案例：从零到上线的完整复盘

## 项目概况

| 维度 | 详情 |
|------|------|
| 产品 | Squish — 浏览器端图片压缩工具 |
| 上线时间 | 2026-07-01 |
| 开发周期 | 1 天（约 6 小时） |
| 网址 | https://squish-ochre.vercel.app（海外）/ https://zgy518.github.io/squish/（备用） |
| 技术栈 | Next.js 16 + TypeScript + Tailwind CSS v4 |
| 部署 | Vercel（主） + GitHub Pages（备） |
| 仓库 | github.com/zgy518/squish |

---

## 为什么选这个方向

### 市场数据
- 图片压缩关键词全球月搜索量 ≈ 86 万次
- 头部竞品 TinyPNG 只有 6 人，年收入 $66 万，界面 10 年没更新
- 个人案例：从零 4 个月做到 $948/月

### 差异化定位
**"压缩到精确目标文件大小"** — TinyPNG 只支持按质量百分比压缩，不支持指定输出大小。这是一个有真实搜索量的长尾需求（"compress image to 100kb" 月搜索 5 万次）。

---

## 技术选型（零成本方案）

| 需求 | 选择 | 理由 |
|------|------|------|
| 框架 | Next.js 16 | Vercel 原生支持，免费部署 |
| 样式 | Tailwind CSS v4 | CSS-first 配置，体积小 |
| 图片压缩 | Canvas API | 纯浏览器端，零成本 |
| 目标大小算法 | 二分查找 | 12 次迭代内收敛到目标 ±5% |
| 部署 | Vercel + GitHub Pages | 双保险，Vercel 对海外快，GitHub Pages 国内能看 |
| 收款 | LemonSqueezy | 5%+$0.50，自动处理全球税务 |
| 分析 | GA4 | 免费 |
| 付费墙 | localStorage | 无需数据库 |

---

## 核心算法

### 目标大小压缩（二分查找）

```typescript
// 核心思路：二分查找 quality ∈ [0.01, 1.0]
// 每次用当前 quality 压缩，对比输出大小与目标
// 输出 < 目标 → quality 可以更低（升下界）
// 输出 > 目标 → quality 需要更高（降上界）
// 最多 12 次迭代，误差 ±5% 即停止
```

### 免费额度管理

```typescript
// localStorage 存储每日计数 + 日期
// 日期变了自动重置计数
// 有 License Key → 跳过所有限制
```

---

## 踩坑记录

| # | 问题 | 解决 |
|---|------|------|
| 1 | npm 不支持中文目录名 "web出海" | 在 /tmp 创建项目，再复制过来 |
| 2 | next.config.ts 中 basePath 对 Vercel 和 GitHub Pages 冲突 | 用 `DEPLOY_TARGET` 环境变量区分 |
| 3 | Vercel 注册需要手机验证，中国号码可能收不到 | 用户自己完成验证 |
| 4 | LemonSqueezy 的 Google reCAPTCHA 被墙 | 需要代理访问；MVP 阶段先手动收款 |
| 5 | Tailwind v4 不再需要 tailwind.config.ts | 改用 `@import "tailwindcss"` + `@theme inline` |
| 6 | Next.js Image 组件在静态导出时需 `unoptimized: true` | next.config.ts 配置 |
| 7 | 所有内部链接必须用 Next.js `<Link>` 而非 `<a>` | 否则 basePath 不对，GitHub Pages 404 |

---

## 部署方案

### 双部署架构

```
同一份代码 → push to master
  ├── Vercel 自动部署（无 basePath）→ squish-ochre.vercel.app
  └── GitHub Actions（DEPLOY_TARGET=github-pages）→ zgy518.github.io/squish/
```

next.config.ts 通过环境变量自动切换：

```typescript
const isGitHubPages = process.env.DEPLOY_TARGET === "github-pages";
// output: isGitHubPages ? "export" : undefined
// basePath: isGitHubPages ? "/squish" : ""
```

---

## 变现模型

| 层级 | 价格 | 内容 |
|------|------|------|
| 免费 | $0 | 15 次/天，单文件 ≤ 10MB |
| 终身 | $9.99 | 无限次，50MB，目标大小压缩，格式转换 |

**为什么是终身制而非订阅？**
- 新品牌信任度低，$9.99 一次性决策门槛极低
- 减少订阅管理复杂度
- 快速积累用户基数

---

## 推广清单

| 渠道 | 状态 | 备注 |
|------|------|------|
| Product Hunt | ⏳ | 免费发布 |
| Reddit (r/InternetIsBeautiful) | ⏳ | 视觉对比截图效果好 |
| Hacker News Show HN | ⏳ | 周末发效果最好 |
| Twitter/X (build-in-public) | ⏳ | 持续更新开发进度 |

---

## 关键教训

1. **先上线再打磨**：MVP 不用完美，核心功能对就行
2. **做差异化**：不要做第二个 TinyPNG，做"压缩到精确大小"
3. **文档驱动**：CLAUDE.md + 标准文档让 AI 每次都有上下文
4. **零成本是真的零**：Canvas API + localStorage + 免费部署 = $0 运营成本
5. **收款是瓶颈**：中国个人收款海外用户是最难的环节，早点验证
