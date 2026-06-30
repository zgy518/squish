# 技术规范

## 技术栈

| 层 | 选型 | 说明 |
|----|------|------|
| 前端框架 | Next.js 14 + TypeScript | React 全栈框架，Vercel 原生支持 |
| 样式方案 | Tailwind CSS | 原子化 CSS，快速开发 |
| 图片处理 | 浏览器 Canvas API | 纯客户端压缩，零服务器成本 |
| 批量处理 | Web Workers | 并行压缩不卡主线程 |
| ZIP 打包 | JSZip | 浏览器端打包下载 |
| 部署 | Vercel | 免费层，GitHub 自动部署 |
| 域名 | {project}.vercel.app | 先用子域名，赚钱后买 .com |
| 数据存储 | localStorage | MVP 阶段存 License Key + 使用次数 |
| 收款 | LemonSqueezy | 5%+$0.50/笔，MoR 自动税务 |
| 分析 | Google Analytics 4 | 免费 |
| 包管理 | npm | — |
| 代码托管 | GitHub (zgy518) | — |

---

## 目录结构

```
web出海/
├── docs/                    # 项目标准文件
│   ├── requirements.md      # 开发需求
│   ├── tech-spec.md         # 技术规范（本文件）
│   ├── design-spec.md       # 设计规范
│   └── execution-plan.md    # 执行步骤
├── dev-logs/                # 每日开发日志
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # 根布局
│   │   ├── page.tsx         # 首页（压缩工具）
│   │   ├── globals.css      # 全局样式 + Tailwind
│   │   └── privacy/         # 隐私政策页
│   ├── components/          # React 组件
│   │   ├── UploadZone.tsx   # 拖拽/点击上传区
│   │   ├── ImagePreview.tsx # 压缩前后对比
│   │   ├── QualitySlider.tsx# 质量滑块
│   │   ├── TargetSizeInput.tsx # 目标大小输入
│   │   ├── DownloadButton.tsx  # 下载按钮
│   │   ├── BatchQueue.tsx   # 批量处理队列
│   │   ├── Paywall.tsx      # 付费升级提示
│   │   ├── LicenseInput.tsx # License Key 输入
│   │   └── Header.tsx       # 顶部导航
│   ├── lib/                 # 工具函数
│   │   ├── compress.ts      # Canvas 压缩核心算法
│   │   ├── targetSize.ts    # 目标大小二分查找算法
│   │   ├── format.ts        # 格式转换函数
│   │   ├── license.ts       # License Key 本地验证
│   │   └── storage.ts       # localStorage 封装
│   ├── workers/             # Web Workers
│   │   └── compress.worker.ts # 批量压缩 Worker
│   └── types/               # TypeScript 类型
│       └── index.ts
├── public/                  # 静态资源
│   ├── robots.txt
│   └── sitemap.xml
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── CLAUDE.md                # AI 助手指引
```

---

## 核心算法

### 1. 质量压缩（Canvas API）

```
输入: File, quality (0-1)
流程:
  1. FileReader → readAsDataURL
  2. new Image() → 加载
  3. canvas.drawImage()
  4. canvas.toBlob(type, quality) 或 canvas.toDataURL(type, quality)
输出: Blob
```

### 2. 目标大小压缩（二分查找）

```
输入: File, targetSizeKB
流程:
  1. qualityLow = 0, qualityHigh = 1
  2. 循环最多 10 次:
     a. qualityMid = (low + high) / 2
     b. compress(input, qualityMid) → blob
     c. if blob.size ≈ target → 返回
     d. if blob.size > target → high = mid
     e. if blob.size < target → low = mid, 记录当前最优
  3. 返回最接近目标大小的结果
输出: Blob (approx targetSizeKB)
```

### 3. 批量处理（Web Workers）

```
输入: File[], options
流程:
  1. 将文件分发给多个 Worker
  2. 每个 Worker 独立压缩一张图
  3. 收集结果，更新进度
输出: Blob[]
```

---

## LemonSqueezy License Key 验证

### 创建 Key

在产品后台批量生成 License Keys，每个 Key 关联产品。

### 验证流程

```
用户输入 Key → 前端格式校验 → 调用 LemonSqueezy API /v1/licenses/validate
  → 有效: 存入 localStorage，解锁付费功能
  → 无效: 显示错误提示
```

### 本地存储结构

```typescript
interface LicenseState {
  key: string;
  valid: boolean;
  activatedAt: string;
  expiresAt: string | null;
}

interface UsageState {
  date: string;        // YYYY-MM-DD
  count: number;       // 今日已用次数
  maxFree: number;     // 免费次数上限 = 15
}
```

---

## 审核避雷清单

- [ ] 隐私政策页面：明确说明所有图片在浏览器本地处理，不上传服务器
- [ ] 无 Cookie 使用（GA4 使用匿名数据）
- [ ] 无用户注册/登录功能（无需 GDPR 复杂合规）
- [ ] LemonSqueezy 税务由平台自动处理
- [ ] robots.txt + sitemap.xml 就位
