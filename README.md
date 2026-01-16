# TeamTutor 智慧虛擬課堂

<div align="center">

![TeamTutor](https://img.shields.io/badge/TeamTutor-智慧虛擬課堂-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)

**以多代理人 (Multi-Agent) 與 RAG 技術建構的適性化合作學習平台**

</div>

---

## 📖 專案概述 (Project Overview)

TeamTutor 是一個專為教育場景設計的 **Next.js** 全端應用程式。其核心架構圍繞著「虛擬課堂」概念，整合了 LLM (Large Language Module) 驅動的 AI 代理人網路，並透過 RAG (Retrieval-Augmented Generation) 技術綁定特定領域知識庫。

**對於開發者而言，本專案展示了以下現代前端架構實踐：**
- **Hybrid Rendering**: 結合 Next.js App Router 的 Server Components 與 Client Components。
- **Feature-First Architecture**: 依據功能模組 (Classroom, Agents, Analytics) 而非技術層分類的目錄結構。
- **Centralized Data Layer**: 透過 Service Pattern 抽象化資料存取，目前由 `MockDataService` 模擬，便於未來替換為真實 API。
- **Strict RBAC**: 嚴謹的角色權限控制系統 (Role-Based Access Control)。

---

## 🏗️ 系統架構 (System Architecture)

### 核心模組

1.  **虛擬課堂引擎 (Classroom Engine)**: 
    - 負責管理多代理人對話狀態。
    - 整合 `MessageList`, `ToolCall`, `ContextPanel` 等即時互動組件。
2.  **代理人編排 (Agent Orchestration)**:
    - `AgentConfig`: 定義 Persona、System Prompt 與 知識庫綁定。
    - `Builder`: 基於 React Flow 的視覺化工作流編輯器，用於設計複雜的對話邏輯。
3.  **RAG 知識庫 (Knowledge Base)**:
    - 管理向量化與非結構化文件，提供 AI 代理人上下文檢索能力。
4.  **數據分析 (Analytics)**:
    - 基於 Recharts 與 React-Grid-Layout 的可視化儀表板。

### 狀態管理策略 (State Management Strategy)

本專案採用 **分離式狀態管理** 策略，避免單一 Store 過度膨脹：

| 狀態類型 | 解決方案 | 說明 | 關鍵檔案 |
|---------|----------|------|---------|
| **UI 狀態** | **Zustand** | 處理 Sidebar 開關、主題切換等純 UI 邏輯。 | `src/lib/store.ts` |
| **用戶/權限** | **Context API** | 全域的使用者身份、角色與權限驗證。 | `src/lib/auth/AuthContext.tsx` |
| **業務數據** | **Service / Hooks** | 頁面級別的數據獲取，目前由 `MockDataService` 提供。 | `src/lib/mock/index.ts` |
| **表單狀態** | **Local State** | 組件內部的表單控制與驗證。 | 各頁面組件 |

### 安全性與權限 (Security & RBAC)

專案實作了嚴格的前端 RBAC：

- **定義層**: `src/lib/auth/permissions.ts` 定義了 UserRole (身分) 與 Permission (權限) 的映射關係。
- **邏輯層**: 提供 `canAccessRoute` 與 `hasPermission` 函式進行邏輯判斷。
- **執行層**:
    - **RouteGuard**: `src/components/auth/RouteGuard.tsx` 攔截路由跳轉，驗證頁面存取權。
    - **Component Check**: 透過 `useAuth()` hook 在組件內部控制按鈕或區塊的顯示/隱藏。

---

## 📁 專案結構 (Project Structure)

```bash
src/
├── app/                        # Next.js App Router (路由層)
│   ├── layout.tsx              # Root Layout (整合 Providers & AppShell)
│   ├── agents/                 # [Feature] AI 代理人管理
│   ├── builder/                # [Feature] Workflow 編輯器
│   ├── classroom/              # [Feature] 虛擬課堂核心
│   ├── dashboard/              # [Feature] 數據儀表板
│   ├── knowledge/              # [Feature] RAG 知識庫
│   └── admin/                  # [Feature] 系統後台
│
├── components/                 # React 組件層
│   ├── admin/                  # 後台專用組件
│   ├── auth/                   # 認證相關 (RouteGuard)
│   ├── builder/                # React Flow 相關組件
│   ├── classroom/              # 聊天室相關組件
│   ├── layout/                 # 布局組件 (AppShell, Sidebar)
│   └── ui/                     # Shadcn/UI 基礎組件庫
│
├── lib/                        # 核心邏輯層
│   ├── auth/                   # 認證與權限邏輯
│   ├── mock/                   # Mock Data Service (統一數據源)
│   └── store.ts                # Zustand UI Store
│
└── types/                      # TypeScript 型別定義
    └── index.ts                # 核心資料模型 (User, Agent, Session...)
```

---

## 🚀 快速開始 (Getting Started)

### 環境需求
- Node.js 18.17+
- npm / yarn / pnpm

### 開發流程

1. **安裝依賴**
   ```bash
   npm install
   ```

2. **啟動開發伺服器**
   ```bash
   npm run dev
   ```
   瀏覽 [http://localhost:3000](http://localhost:3000)

3. **建置生產版本**
   ```bash
   npm run build
   npm start
   ```

---

## 🛠️ 技術棧詳解 (Tech Stack)

| 類別 | 技術選型 | 選擇理由 |
|------|----------|----------|
| **Core** | Next.js 16 | 利用 App Router 與 Server Components 優化效能與 SEO。 |
| **Language** | TypeScript 5 | 確保型別安全，減少 Runtime Error，提升維護性。 |
| **Styling** | Tailwind CSS 4 | Utility-first CSS，配合 Shadcn/UI 快速建構一致性介面。 |
| **Interaction** | React Flow | 強大的節點編輯庫，支援複雜的 Agent Workflow 設計。 |
| **Visuals** | Lucide React | 輕量且風格統一的 SVG Icon 庫。 |
| **Layout** | React Grid Layout | 提供 Dashboard 高度客製化的拖曳布局能力。 |

---

## 📚 開發指南 (Contribution Guide)

1.  **新增頁面**: 在 `src/app` 下建立對應資料夾。若需權限控制，請更新 `src/lib/auth/permissions.ts` 中的 `ROUTE_PERMISSIONS`。
2.  **修改數據**: 所有 Mock 數據讀取 **必須** 透過 `src/lib/mock/index.ts` 中的 `MockDataService`，禁止直接 import JSON 檔案，以確保未來 API 遷移的順暢性。
3.  **UI 組件**: 優先使用 `src/components/ui` 下的共用組件。若需新組件，請參考 Shadcn/UI 規範。

---

## 📜 授權

本專案為臺中教育大學採購專案。