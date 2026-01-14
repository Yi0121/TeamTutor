# TeamTutor 前端開發實作規格書 (Agent Context)

## 1. 專案概述 (Project Overview)
本專案為「TeamTutor 智慧虛擬課堂」，一個基於 Multi-Agent 與 RAG 技術的教育平台。
核心功能包含：即時多代理人聊天室、視覺化流程編輯器 (Node-based)、學習儀表板。

## 2. 技術棧 (Tech Stack)
* **Framework**: Next.js 14 (App Router)
* **Styling**: Tailwind CSS + Shadcn/UI (必須使用)
* **Icons**: Lucide React
* **State Management**: Zustand (Global Store) + React Context (Local State)
* **Visualization**:
    * Flow Editor: React Flow (必要)
    * Charts: Recharts
* **Markdown Rendering**: react-markdown, rehype-katex (數學公式), react-syntax-highlighter

## 3. 全域設計系統 (Design Tokens)
請在 `tailwind.config.ts` 設定以下變數：
* **Primary Color**: `blue-600` (#2563EB)
* **Secondary Color**: `amber-500` (#F59E0B)
* **Background**: `slate-50` (#F8FAFC)
* **Font**: Inter (預設)

## 4. 核心頁面與組件規格 (Core Requirements)

### 4.1. 多代理人對話教室 (Page: `/classroom/[id]`)
**Layout**: 三欄式佈局 (Three-column Layout)
1.  **Left Sidebar (280px, Collapsible)**: `ParticipantsPanel`
    * 顯示參與者列表 (User + AI Agents)。
    * 每個 Item 顯示：Avatar, Name, Role Badge (Teacher/Student), Status Indicator (Active/Thinking).
2.  **Main Area (Flex-1)**: `ChatInterface`
    * `MessageList`: 支援自動滾動。
    * `MessageBubble`:
        * User: 藍底白字，靠右。
        * AI: 白底黑字，靠左，顯示 Avatar 與 Name。
        * 支援 Markdown, LaTeX ($E=mc^2$), Code Block。
        * **特殊顯示**: 若 message 包含 `tool_call` (如 GeoGebra)，需渲染為特殊卡片組件。
    * `InputArea` (Sticky Bottom):
        * Textarea (Auto-resize).
        * Buttons: Upload, Voice Input, Send.
3.  **Right Sidebar (300px)**: `ContextPanel`
    * 顯示學習目標 Checklist (Checkbox list)。
    * 顯示當前即時統計 (Session Stats)。

### 4.2. 視覺化情境編輯器 (Page: `/builder`)
**Library**: 使用 `React Flow`
1.  **Canvas**: 無限畫布，支援縮放、平移。
2.  **Node Types (自定義節點)**:
    * `AgentNode`: 顯示 Agent Avatar, Name, Model Select。
    * `ConditionNode`: 菱形外觀，顯示 Logic。
    * `ActionNode`: 顯示 Action Icon (e.g., Send Message)。
3.  **Sidebar (Drag & Drop)**:
    * 提供上述 Node 的拖曳來源。
    * 屬性編輯面板 (點擊 Node 後顯示)。

### 4.3. 學習儀表板 (Page: `/dashboard`)
**Library**: 使用 `Recharts`
1.  **Grid Layout**: 響應式卡片佈局。
2.  **Widgets**:
    * `UsageChart`: Bar Chart (每日對話數)。
    * `AbilityRadar`: Radar Chart (溝通/協作/批判思考)。
    * `HistoryTable`: 列表顯示最近的 Session，含「重播(Replay)」按鈕。

## 5. 狀態管理 (State Management)
使用 Zustand 建立 `useStore`：
* `sessions`: 儲存對話紀錄。
* `agents`: 儲存當前活躍的 Agent 設定。
* `uiState`: 控制 Sidebar 開關、Modal 顯示。