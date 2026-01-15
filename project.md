# TeamTutor智慧虛擬課堂建置方案—以多代理人與RAG技術建構適性化合作學習環境

## 1. 專案概述
### 1.1 專案名稱
「TeamTutor智慧虛擬課堂建置方案—以多代理人與RAG技術建構適性化合作學習環境」採購專案。

### 1.2 專案背景與說明
近年來，生成式AI與大型語言模型（LLMs）蓬勃發展，AI驅動之教育代理人已成為提升學習成效之重要工具。
* **現況問題**：現行數位學習工具存在限制，適性學習系統缺乏同儕互動，線上協作平臺難以確保形成有效學習團隊。
* **解決方案**：結合多代理人系統（Multi-Agent Systems, MAS）與大型語言模型，提供創新方案。

### 1.3 核心技術架構
本專案旨在建構「TeamTutor」智慧虛擬課堂，整合以下核心技術：
1.  **多代理人虛擬課堂核心引擎**：基於 LangChain/LangGraph，透過 Agent Orchestrator 協調多角色（虛擬學伴、教師）對話，實現三人對話（Trialogue）或多人討論。
2.  **MCP 與 Agentic RAG 動態對話策略**：導入 Model Context Protocol (MCP) 整合外部工具（GeoGebra、搜尋、程式碼執行），並採用 Agentic RAG 架構動態調整檢索與回應策略。
3.  **RAG 學科知識庫**：建置向量資料庫，透過檢索增強生成（RAG）降低幻覺，確保內容正確性。
4.  **視覺化情境設定平臺**：提供拖曳式 Workflow 編輯器，降低教師設計 AI 角色與互動流程的門檻。
5.  **學習歷程分析與儀表板**：以 Event Sourcing 記錄互動，提供視覺化儀表板與歷程回放。
6.  **數據安全與權限管理**：採用四級權限架構與 RBAC 模型，符合資通安全責任等級中級防護基準。

### 1.4 應用模式
* **第一軌：學生合作學習模式**
    * 提供「理想學習團隊」，培養溝通協作與批判思考。
    * 教師可設計認知衝突或「以教促學」策略。
    * AI 學伴知識程度由 RAG 控制，風格由 System Prompt 定義。
* **第二軌：師資生模擬實習模式**
    * 提供虛擬實習場域，演練差異化教學與班級經營。
    * 系統模擬不同特質 AI 學生（積極、被動、理解困難）。
    * 支援歷程重播、標註評論、自動生成教學分析報告與省思日誌。

### 1.5 專案目標
1.  建構多代理人虛擬課堂核心引擎，模擬多元高效學習小組。
2.  導入 MCP 與 Agentic RAG，實現動態對話調控與工具串接。
3.  建置 RAG 學科知識庫，確保回應正確性。
4.  開發友善之視覺化情境設定介面。
5.  建構學習歷程分析與儀表板。
6.  確保技術可靠性與數據安全。

---

## 2. 專案需求規格詳細說明

### 2.1 模組一：多代理人虛擬課堂核心引擎

#### 2.1.1 多代理人對話引擎架構
* **基礎框架**：LangChain 或 LangGraph。
* **核心組件**：
    * `Agent Orchestrator`（代理人協調器）：管理生命週期與對話排程。
    * `State Manager`（狀態管理器）：維護上下文、狀態與共享記憶體。
    * `Message Router`（訊息路由器）：分配使用者訊息與代理人回應。
    * `Tool Executor`（工具執行器）：呼叫外部工具處理結果。
* **LLM 支援**：需同時運行多個 API（OpenAI GPT-4o/mini, Anthropic Claude 3.5 Sonnet/Haiku, Google Gemini 1.5 Pro/Flash），且每位代理人可獨立設定模型。
* **UI 介面設計**：
    * **左側（參與者面板）**：顯示角色頭像、名稱、標籤（如虛擬教師），點擊可查看設定。
    * **中央（對話區域）**：聊天室介面，區分發送者與背景色，支援 Markdown、LaTeX、程式碼高亮。
    * **右側（情境資訊面板）**：顯示學習主題、目標、時間、統計。
    * **底部（輸入區域）**：文字輸入、檔案上傳、語音輸入、送出按鈕。

#### 2.1.2 AI 代理人角色設定機制
* **資料結構 (JSON Parameter Set)**：
    * `base_model`：LLM 模型識別碼。
    * `system_prompt`：角色設定提示詞（人格、領域、規範）。
    * `knowledge_level`：1-10 數值，影響 RAG 檢索採用比例與回答深度。
    * `communication_style`：包含 `formality`（正式度）、`verbosity`（詳細度）、`encouragement`（鼓勵度）。
    * `rag_knowledge_base_ids`：關聯知識庫 ID 陣列。
    * `temperature`：創造性參數。
    * `max_tokens`：最大回應長度。
* **動態組裝**：每次對話動態整合角色設定、歷史、RAG 結果與使用者輸入至 Prompt。
* **UI 設定頁面**：
    * **基本資訊**：頭像（上傳或 DALL-E 生成）、名稱、說明、初始問候。
    * **進階設定**：LLM 下拉選單、System Prompt 編輯（含範本）、知識精熟度滑桿、溝通風格滑桿、知識庫多選、建議問題設定。
    * **功能按鈕**：預覽測試、儲存、另存為模板。

#### 2.1.3 多角色對話協調機制
* **對話狀態機 (Conversation State Machine)**：
    * `WAITING_USER`
    * `AGENT_THINKING`
    * `AGENT_RESPONDING`
    * `TOOL_EXECUTING`
* **回應順序邏輯**：
    1.  特定指向判斷（如「老師請問...」）。
    2.  無特定指向則依 `relevance_score`（LLM 即時計算）排序。
    3.  支援規則設定（如「學生發言後教師必須回應」）。
* **三人對話 (Trialogue) 優化**：確保人類與兩位 AI 間形成有意義互動，避免 AI 間過度對話。

---

### 2.2 模組二：MCP 與 Agentic RAG 模組

#### 2.2.1 Model Context Protocol (MCP) 整合
* **架構**：
    * `MCP Server`：註冊工具（name, description, input_schema, handler）。
    * `MCP Client`：整合於引擎，負責查詢與呼叫。
    * `Tool Registry`：資料庫儲存工具 metadata。
* **執行流程**：產生 function calling 請求 -> MCP Client 路由 -> MCP Server 執行 -> 結果注入上下文。
* **必備工具**：
    1.  **GeoGebra 數學工具**：API 整合，支援函數圖形、幾何圖形、代數運算，圖形嵌入對話顯示。
    2.  **網頁搜尋工具**：Google/Bing API，搜尋時事並顯示來源網址。
    3.  **程式碼執行工具**：安全沙箱（Docker），支援 Python，結果與圖表嵌入顯示。
    4.  **計算機工具**：四則運算、三角函數、對數等。
* **UI 管理頁面**：卡片清單呈現工具狀態與統計，支援參數設定、日誌查看、功能測試及新增自訂工具（表單或定義檔）。

#### 2.2.2 Agentic RAG 實作
* **核心架構 (LangGraph)**：
    * `Query Analyzer`：分析問題，產生優化查詢（支援問題分解）。
    * `Retrieval Planner`：決定策略（知識庫選擇、top_k、多輪檢索）。
    * `Result Evaluator`：評估品質，決定是否補充檢索。
    * `Response Synthesizer`：整合結果生成回應。
* **對話策略引擎**：
    * **分析因子**：目標達成進度（Checklist）、理解程度、對話氛圍、時間因素。
    * **調整項目**：回應策略（詳解/提示/引導）、檢索深度、引入新觀點、主動鷹架。
    * **實作方式**：Prompt Engineering 動態修改 System Prompt 與 Context。

---

### 2.3 模組三：RAG 知識庫管理模組

#### 2.3.1 向量資料庫建置
* **資料庫選型**：Chroma, Milvus, Pinecone, Weaviate 或 PostgreSQL+pgvector。
* **處理 Pipeline**：
    * `Document Loader`：支援 PDF, DOCX, TXT, MD, HTML。
    * `Text Splitter`：RecursiveCharacterTextSplitter，chunk_size 500-1000，overlap 50-100。
    * `Embedding Generator`：OpenAI text-embedding-3-small 或同級模型。
    * `Vector Store`：儲存向量與 metadata。
* **UI 介面**：
    * **清單**：知識庫卡片（名稱、文件數、更新時間）。
    * **詳情頁 Tab**：
        * 「文件管理」：上傳（拖曳/批次）、刪除、重處理。
        * 「設定」：Chunk 參數、Embedding 模型、權限。
        * 「檢索測試」：輸入問題驗證 Chunk 品質與相似度。

#### 2.3.2 知識庫版本管理
* **機制**：每次增刪改產生新版本記錄。
* **記錄內容**：版本號、操作類型、時間、操作者、變更摘要。
* **功能**：支援還原至任一歷史版本（Git-like 或 Time Travel）。
* **UI**：「版本歷史」Tab，時間軸顯示，提供還原按鈕。

---

### 2.4 模組四：視覺化情境設定平臺

#### 2.4.1 Agentic Workflow 視覺化編輯器
* **技術**：React + react-flow（或類似套件）。
* **節點類型**：
    * `Agent Node`：設定角色屬性。
    * `Trigger Node`：啟動條件（發言、關鍵字、時間）。
    * `Condition Node`：分支邏輯（If-Else）。
    * `Action Node`：系統動作（發送訊息、呼叫工具、等待）。
    * `End Node`：結束條件。
* **儲存格式**：序列化為 JSON，由 Workflow Engine 解析。
* **UI 佈局**：
    * **左欄**：元件面板（可拖曳）。
    * **中央**：畫布（拖曳、連線、縮放），下方有 Minimap。
    * **右欄**：屬性面板（動態表單）。
    * **工具列**：儲存、載入、匯出、預覽。

#### 2.4.2 情境模板系統
* **功能**：儲存 Workflow Graph、代理人設定、知識庫參照。
* **預載模板**：
    * 三人討論模板
    * 蘇格拉底對話模板
    * 以教促學模板
    * 辯論模板
    * 模擬課堂模板（師資生用）
* **UI**：「系統模板」與「我的模板」卡片牆。支援預覽詳情與「使用此模板」開啟新專案。

---

### 2.5 模組五：學習歷程分析與儀表板

#### 2.5.1 學習歷程紀錄系統
* **模式**：Event Sourcing。
* **事件類型**：`MESSAGE_SENT`, `TOOL_INVOKED`, `RAG_RETRIEVED`, `AGENT_STATE_CHANGED`, `SESSION_STARTED/ENDED`。
* **儲存**：時序資料庫或關聯式資料庫，以 `conversation_id` 關聯。
* **UI**：
    * **列表**：依時間倒序，支援篩選。
    * **回放區**：聊天介面重現，具時間軸、播放控制。
    * **標註**：新增評語（讚美/建議/問題）。
    * **匯出**：PDF/Word 報告。

#### 2.5.2 學習儀表板
* **Pipeline**：定期彙整統計指標。
* **指標**：
    * `usage_metrics`：次數、訊息數、時長。
    * `engagement_metrics`：對話長度、主動發問率、延遲時間。
    * `learning_metrics`：教師定義 rubric + LLM 評分。
* **技術**：Chart.js 或 ECharts。
* **UI**：
    * 可拖曳 Widget（班級概況、學生排行、熱門代理人、異常警示）。
    * 自訂儀表板佈局。
    * 時間範圍選擇（日/週/月）。

#### 2.5.3 師資生教學省思模組
* **教學演練報告**：LLM 分析產出（策略運用、互動比例、學生反應處理、改進建議）。
* **教學省思日誌**：結構化表單（目標、摘要、自評、反思、計畫）。
* **指導教授回饋**：線上檢視歷程與日誌，給予文字評語。

---

### 2.6 模組六：權限管理與系統管理

#### 2.6.1 帳號與權限管理
* **架構**：RBAC 四級權限。
    * **Super Admin**：全系統管理、API 金鑰、配額與費用。
    * **School Admin**：校級管理、指派代理人、檢視校級統計。
    * **Teacher**：管理自身代理人/知識庫、指派給學生、檢視班級歷程。
    * **Student**：使用指派代理人、檢視個人歷程。
* **UI**：樹狀組織架構，支援批次匯入/匯出/指派。

#### 2.6.2 使用量監測與成本控管
* **追蹤紀錄**：`user_id`, `api_provider`, `model_name`, `input_tokens`, `output_tokens`, `cost`, `timestamp`。
* **配額管理**：設定日/月 Token 上限，80%/90%/100% 發送通知，100% 暫停權限。
* **UI**：
    * 總覽卡片（用量、費用、成長率）。
    * 多維度分析 Tab（依時間、使用者、模型、代理人），支援 Drill-down 與 CSV 匯出。

#### 2.6.3 嵌入與整合功能
* **嵌入方式**：
    1.  **iframe 嵌入**：含認證 token，可設尺寸與主題。
    2.  **聊天氣泡嵌入**：JavaScript 代碼，右下角圖示，支援 CORS 與防濫用（referrer 白名單、頻率限制）。
* **UI**：設定區（方式、外觀、網域、認證）+ 預覽區 + 程式碼複製區。