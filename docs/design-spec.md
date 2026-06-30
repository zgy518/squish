# 设计规范

## 设计理念

现代极简，TinyPNG 竞品对标但更现代。减少视觉噪音，让用户专注于「上传-压缩-下载」的核心流程。信任感来自清晰的信息展示（压缩率、文件大小对比），而非复杂的装饰。

参考：TinyPNG 的功能 + Linear/Vercel 的审美

---

## 色彩体系

| 用途 | 色值 | Tailwind | 说明 |
|------|------|----------|------|
| 主色 | #6366F1 | indigo-500 | 按钮、链接、强调 |
| 主色深 | #4F46E5 | indigo-600 | 按钮 hover |
| 浅色 | #EEF2FF | indigo-50 | 主色浅底 |
| 成功 | #10B981 | emerald-500 | 压缩成功、下载按钮 |
| 警告 | #F59E0B | amber-500 | 接近限制 |
| 错误 | #EF4444 | red-500 | 错误提示 |
| 背景 | #FAFAFA | gray-50 | 主背景 |
| 卡片 | #FFFFFF | white | 卡片、上传区 |
| 正文 | #18181B | zinc-900 | 标题、重要文字 |
| 次要文字 | #71717A | zinc-500 | 说明、辅助文字 |
| 分割线 | #E4E4E7 | zinc-200 | 分割、边框 |

---

## 字体层级

| 层级 | 字号 | 字重 | Tailwind | 用途 |
|------|------|------|----------|------|
| Display | 48px/60px | 700 | text-5xl font-bold | 首页大标题 |
| H1 | 30px/40px | 600 | text-3xl font-semibold | 区块标题 |
| H2 | 20px/28px | 600 | text-xl font-semibold | 子标题 |
| Body | 16px/24px | 400 | text-base | 正文 |
| Caption | 14px/20px | 400 | text-sm | 辅助说明 |
| Small | 12px/16px | 400 | text-xs | 标签、徽标 |

字体：系统默认字体栈（`font-sans`），英文优先。

---

## 间距系统

- 基础单位：4px（Tailwind 默认）
- 页面边距：16px (mobile) / 24px (tablet) / 自适应 (desktop)
- 区块间距：py-16 (64px) 或 py-24 (96px)
- 卡片内边距：p-6 (24px)
- 元素间距：gap-4 (16px)

---

## 圆角

- 按钮/输入框：rounded-xl (12px)
- 卡片/上传区：rounded-2xl (16px)
- 图片预览：rounded-lg (8px)
- 徽标/小标签：rounded-full (全圆)

---

## 阴影

- 卡片阴影：shadow-sm（微妙层级感）
- 上传区拖拽态：shadow-lg + ring-2 + ring-indigo-500
- 按钮 hover：shadow-md
- 付费卡片：shadow-xl（突出）

---

## 布局

- 最大内容宽度：max-w-2xl (672px) — 工具页窄布局，聚焦核心操作
- 页头/页脚：max-w-6xl (1152px)
- 左右边距：px-4 (mobile) / px-6 (desktop)

---

## 动效

- 过渡时间：transition-all duration-200
- 缓动曲线：ease-in-out
- 上传区拖入：scale-[1.02] + shadow-lg + border-indigo-500
- 压缩完成：数字跳动、压缩率绿色高亮
- 按钮点击：scale-95 反馈

---

## 页面布局（首页）

```
┌──────────────────────────────────┐
│           Header (Logo + CTA)    │
├──────────────────────────────────┤
│                                  │
│     Display Title + Subtitle     │
│                                  │
│  ┌────────────────────────────┐  │
│  │                            │  │
│  │       Upload Zone          │  │
│  │    Drag & Drop or Click    │  │
│  │                            │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌──────────┐  ┌──────────────┐  │
│  │ Original  │  │  Compressed  │  │
│  │   Image   │  │    Image     │  │
│  │  2.4 MB   │  │   480 KB ↓80%│  │
│  └──────────┘  └──────────────┘  │
│                                  │
│     [Quality Slider] [Download]  │
│                                  │
├──────────────────────────────────┤
│      Features / Why Us           │
├──────────────────────────────────┤
│           Footer                 │
└──────────────────────────────────┘
```
