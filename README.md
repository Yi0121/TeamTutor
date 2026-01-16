# TeamTutor 智慧虛擬課堂

<div align="center">

![TeamTutor](https://img.shields.io/badge/TeamTutor-智慧虛擬課堂-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)

**以多代理人與 RAG 技術建構適性化合作學習環境**

</div>

---

## 📖 專案概述

TeamTutor 是一個基於 **Multi-Agent** 與 **RAG (Retrieval-Augmented Generation)** 技術的智慧教育平台，旨在提供創新的數位學習環境。

### 核心功能

- 🤖 **多代理人虛擬課堂** - AI 教師、AI 學伴與真人學生的三方互動
- 📚 **RAG 知識庫** - 向量化文件檢索，降低 AI 幻覺
- 🔧 **MCP 工具整合** - GeoGebra、程式碼執行、網頁搜尋等外部工具
- 🎨 **視覺化情境編輯器** - 拖曳式 Workflow 設計
- 📊 **學習歷程分析** - 事件溯源與可視化儀表板

---

## 🚀 快速開始

### 環境需求

- Node.js 18.17+
- npm / yarn / pnpm

### 安裝與執行

```bash
# 複製專案
git clone https://github.com/Yi0121/TeamTutor.git
cd TeamTutor

# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

---

## 📁 專案結構

```
src/
├── app/                        # Next.js 16 App Router 頁面
│   ├── page.tsx                # 首頁（導航入口）
│   ├── layout.tsx              # Root Layout
│   ├── globals.css             # 全域樣式
│   │
│   ├── admin/                  # 系統管理模組
│   │   ├── page.tsx            # 管理儀表板
│   │   ├── organization/       # 組織架構管理
│   │   │   └── page.tsx
│   │   └── quota/              # Token 配額管理
│   │       └── page.tsx
│   │
│   ├── agents/                 # AI 代理人模組
│   │   ├── page.tsx            # 代理人列表
│   │   └── [id]/               # 代理人詳情/編輯
│   │       └── page.tsx
│   │
│   ├── builder/                # Workflow 視覺化編輯器
│   │   └── page.tsx
│   │
│   ├── classroom/              # 多代理人虛擬課堂
│   │   └── [id]/               # 課堂對話頁
│   │       ├── page.tsx
│   │       └── layout.tsx
│   │
│   ├── dashboard/              # 學習儀表板
│   │   ├── page.tsx            # 主儀表板（可拖曳 Widget）
│   │   └── analytics/          # 進階分析
│   │       └── page.tsx
│   │
│   ├── embed/                  # 嵌入設定
│   │   └── page.tsx
│   │
│   ├── history/                # 學習歷程模組
│   │   ├── page.tsx            # 歷程列表
│   │   └── [id]/               # 歷程詳情
│   │       ├── page.tsx        # 回放頁面
│   │       └── report/         # 省思報告
│   │           └── page.tsx
│   │
│   ├── knowledge/              # RAG 知識庫模組
│   │   ├── page.tsx            # 知識庫列表
│   │   └── [id]/               # 知識庫詳情
│   │       └── page.tsx
│   │
│   ├── templates/              # 情境模板庫
│   │   └── page.tsx
│   │
│   └── tools/                  # MCP 工具模組
│       ├── page.tsx            # 工具列表
│       └── [id]/               # 工具詳情
│           └── page.tsx
│
├── components/                 # React 共用組件
│   ├── Providers.tsx           # Context Providers 包裝
│   ├── admin/                  # 管理後台組件
│   │   └── BatchImportModal.tsx
│   ├── auth/                   # 權限相關組件
│   │   └── RoleSwitcher.tsx
│   ├── builder/                # Workflow 編輯器組件
│   │   ├── CanvasToolbar.tsx
│   │   ├── NodePalette.tsx
│   │   ├── PropertyPanel.tsx
│   │   └── nodes/              # 自訂節點類型
│   │       ├── AgentNode.tsx
│   │       ├── TriggerNode.tsx
│   │       ├── ConditionNode.tsx
│   │       ├── ActionNode.tsx
│   │       └── EndNode.tsx
│   ├── classroom/              # 課堂相關組件
│   │   ├── ChatInterface.tsx   # 主對話介面
│   │   ├── MessageBubble.tsx   # 訊息氣泡
│   │   ├── MessageList.tsx
│   │   ├── InputArea.tsx       # 輸入區域
│   │   ├── ParticipantsPanel.tsx
│   │   ├── ContextPanel.tsx
│   │   ├── ToolCallCard.tsx
│   │   ├── AgentConfigDrawer.tsx
│   │   └── ConversationStatusBar.tsx
│   ├── history/                # 歷程回放組件
│   │   └── PlaybackControls.tsx
│   ├── tools/                  # 工具管理組件
│   │   └── AddToolModal.tsx
│   └── ui/                     # 基礎 UI 組件 (Radix-based)
│       ├── accordion.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── latex-renderer.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── slider.tsx
│       ├── tabs.tsx
│       └── textarea.tsx
│
├── lib/                        # 工具函式與服務
│   ├── api.ts                  # API 服務層 (Mock)
│   ├── store.ts                # Zustand 狀態管理
│   ├── utils.ts                # 通用工具函式
│   └── auth/                   # RBAC 權限系統
│       ├── index.ts            # 模組匯出
│       ├── AuthContext.tsx     # 認證 Context
│       ├── PermissionGuard.tsx # 權限守衛組件
│       └── permissions.ts      # 角色權限定義
│
└── types/                      # TypeScript 型別定義
    ├── index.ts                # 核心型別
    ├── react-katex.d.ts        # KaTeX 型別補丁
    └── speech-recognition.d.ts # Web Speech API 型別
```

### 目錄說明

| 目錄 | 用途 |
|------|------|
| `app/` | Next.js 16 App Router，每個資料夾對應一個路由 |
| `components/` | 可重用的 React 組件，依功能模組分類 |
| `lib/` | 核心邏輯：API 呼叫、狀態管理、權限系統 |
| `types/` | TypeScript 型別定義與第三方型別補丁 |

---

## 🛠️ 技術棧

| 類別 | 技術 |
|------|------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 + Shadcn/UI |
| **Icons** | Lucide React |
| **Flow Editor** | React Flow |
| **Charts** | Recharts |
| **Grid Layout** | react-grid-layout |
| **Markdown** | react-markdown + rehype-katex |
| **Code Highlight** | react-syntax-highlighter |

---

## 📍 路由總覽

| 路由 | 說明 |
|------|------|
| `/` | 首頁 (Landing Page) |
| `/classroom/[id]` | 多代理人對話教室 |
| `/agents` | AI 代理人列表 |
| `/agents/[id]` | 代理人設定編輯 |
| `/builder` | 視覺化情境編輯器 |
| `/knowledge` | RAG 知識庫列表 |
| `/knowledge/[id]` | 知識庫詳情與設定 |
| `/tools` | MCP 工具列表 |
| `/tools/[id]` | 工具詳情與測試 |
| `/dashboard` | 學習儀表板 (可拖曳 Widget) |
| `/history` | 學習歷程列表 |
| `/history/[id]` | 歷程回放與標註 |
| `/templates` | 模板庫 (Agent/Workflow) |
| `/embed` | 嵌入設定 (iframe/Bubble) |
| `/admin` | 系統管理 |
| `/admin/organization` | 組織架構管理 |

---

## 🎓 應用場景

### 1. 學生合作學習模式
提供「理想學習團隊」，透過與 AI 學伴互動培養協作與批判思考能力。教師可設計認知衝突或「以教促學」策略。

### 2. 師資生模擬實習模式
提供虛擬實習場域，模擬不同特質的 AI 學生，供師資生練習教學策略，並支援歷程重播與自動生成教學分析報告。

---

## 📜 授權

本專案為臺中教育大學採購專案。