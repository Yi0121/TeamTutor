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
├── app/                        # Next.js App Router 頁面
│   ├── admin/                  # 系統管理
│   │   ├── page.tsx           # 管理儀表板
│   │   └── organization/      # 組織架構管理
│   ├── agents/                 # AI 代理人
│   │   ├── page.tsx           # 代理人列表
│   │   └── [id]/              # 代理人編輯
│   ├── builder/               # 視覺化情境編輯器
│   ├── classroom/[id]/        # 多代理人對話教室
│   ├── dashboard/             # 學習儀表板
│   ├── embed/                 # 嵌入設定
│   ├── history/               # 學習歷程
│   ├── knowledge/             # 知識庫管理
│   ├── templates/             # 模板庫
│   └── tools/                 # MCP 工具管理
├── components/                 # React 組件
│   ├── builder/               # 流程編輯器組件
│   ├── classroom/             # 教室相關組件
│   └── ui/                    # Shadcn/UI 組件
├── lib/                       # 工具函式
└── types/                     # TypeScript 型別定義
```

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