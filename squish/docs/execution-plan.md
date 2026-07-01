# 执行步骤

## 阶段总览

| 阶段 | 目标 | 预计工期 | 状态 |
|------|------|----------|------|
| 0 | 项目骨架 + 文档体系 | 2026-07-01 | 🟢 进行中 |
| 1 | 核心功能（上传+压缩+对比+下载） | Day 2-3 | ⏳ |
| 2 | 目标大小压缩 + 批量处理 | Day 4 | ⏳ |
| 3 | 付费墙 + License Key | Day 5 | ⏳ |
| 4 | 打磨（响应式+SEO+分析） | Day 6-7 | ⏳ |
| 5 | 上线推广 | Day 8-14 | ⏳ |

---

## 阶段 0 — 项目骨架（完成）

- [x] 创建目录结构（docs/、dev-logs/、src/、public/）
- [x] CLAUDE.md 项目 AI 助手指引
- [x] docs/requirements.md 开发需求文档
- [x] docs/tech-spec.md 技术规范文档
- [x] docs/design-spec.md 设计规范文档
- [x] docs/execution-plan.md 执行步骤文档（本文件）
- [x] dev-logs/2026-07-01.md 今日开发日志
- [ ] Next.js 项目初始化（`npx create-next-app`）
- [ ] Git init + GitHub push
- [ ] Vercel 部署

**验证标准**：`{project}.vercel.app` 可访问，显示 Next.js 默认页

---

## 阶段 1 — 核心功能

- [ ] UploadZone 组件（拖拽 + 点击上传）
- [ ] Canvas 质量压缩核心算法（lib/compress.ts）
- [ ] ImagePreview 组件（压缩前后对比）
- [ ] QualitySlider 组件（质量 0-100%）
- [ ] DownloadButton 组件（单张下载）
- [ ] 文件大小格式化工具
- [ ] 首页布局（Header + 上传区 + 预览 + 下载）

**验证标准**：上传一张图片 → 拖动质量滑块 → 看到压缩前后对比 → 下载

---

## 阶段 2 — 差异化功能

- [ ] 目标大小压缩算法（lib/targetSize.ts）二分查找逼近
- [ ] TargetSizeInput 组件
- [ ] 批量上传 + Web Worker 并行处理
- [ ] BatchQueue 组件（进度显示）
- [ ] JSZip 批量下载
- [ ] 格式转换（PNG↔JPG↔WebP）

**验证标准**：输入目标 100KB → 压缩结果接近 100KB；批量上传 10 张图 → 并行压缩 → ZIP 下载

---

## 阶段 3 — 变现

- [ ] localStorage 封装（lib/storage.ts）
- [ ] 免费次数限制逻辑（每日 15 次）
- [ ] License Key 验证（lib/license.ts）
- [ ] Paywall 组件（优雅升级提示）
- [ ] LicenseInput 组件
- [ ] LemonSqueezy 后台配置（用户操作）

**验证标准**：用到 15 次后触发升级提示 → 输入 License Key → 解锁

---

## 阶段 4 — 打磨

- [ ] 响应式布局（手机/平板/桌面）
- [ ] SEO：meta tags、sitemap.xml、robots.txt、Schema.org
- [ ] Google Analytics 4 接入
- [ ] 隐私政策页面
- [ ] 首屏加载性能优化
- [ ] 错误状态处理（文件过大、格式不支持等）

**验证标准**：手机端操作流畅、PageSpeed Insights > 90、GA4 有数据

---

## 阶段 5 — 上线推广

- [ ] 注册 LemonSqueezy + PayPal/Wise（用户操作）
- [ ] Vercel 自定义域名（可选）
- [ ] Product Hunt 发布
- [ ] Reddit 发布（r/InternetIsBeautiful, r/webdev 等）
- [ ] Hacker News Show HN
- [ ] Twitter/X build-in-public

**验证标准**：网站全球可访问、支付链路打通、至少 1 个渠道有流量

---

## 开发日志

| 日期 | 完成事项 | 待办事项 |
|------|----------|----------|
| 2026-07-01 | 项目骨架：目录结构、5 份标准文档 | 初始化 Next.js 项目 |
