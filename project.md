# TeamTutor智慧虛擬課堂建置方案—以多代理人與RAG技術建構適性化合作學習環境

## 1. 專案名稱
[cite_start]「TeamTutor智慧虛擬課堂建置方案—以多代理人與RAG技術建構適性化合作學習環境」採購專案（以下簡稱本專案） [cite: 3, 4]。

---

## 2. 專案說明

### 2.1 背景與願景
[cite_start]近年來，生成式AI與大型語言模型（Large Language Models, LLMs）蓬勃發展，AI驅動之教育代理人已成為提升學習成效之重要工具。惟現行數位學習工具仍存在明顯限制：適性學習系統雖能依據學生作答情形調整難度，卻缺乏同儕互動之學習刺激；線上協作平臺雖可促進學生討論，卻難以確保每次皆能形成有效之學習團隊。多代理人系統（Multi-Agent Systems, MAS）結合大型語言模型之應用，為解決前述困境提供創新方案 [cite: 6]。

[cite_start]本專案旨在建構「TeamTutor」智慧虛擬課堂，為學生提供AI學習夥伴，為師資生提供模擬實習場域，打造適性化合作學習環境 [cite: 7]。

### 2.2 核心技術架構
系統將整合以下核心技術：

1.  [cite_start]**多代理人虛擬課堂核心引擎**：以 LangChain 或 LangGraph 框架為基礎，建構可同時運行多個 AI 代理人（虛擬學伴、虛擬教師）的對話引擎。透過 Agent Orchestrator 協調多角色對話順序，實現三人對話（Trialogue）或多人討論模式 [cite: 8]。
2.  [cite_start]**MCP 與 Agentic RAG 動態對話策略**：導入 Model Context Protocol（MCP）標準化協議整合外部工具（GeoGebra、網頁搜尋、程式碼執行等）。採用 Agentic RAG 架構，使 AI 代理人能自主判斷並動態調整檢索與回應策略 [cite: 9]。
3.  [cite_start]**RAG 學科知識庫**：建置向量資料庫儲存學科教材，透過檢索增強生成（Retrieval-Augmented Generation）技術，確保 AI 回應基於正確的教材內容，降低幻覺問題 [cite: 10]。
4.  [cite_start]**視覺化情境設定平臺**：提供 Agentic 概念之拖曳式 Workflow 編輯器，讓無程式設計背景的教師也能透過視覺化介面設計 AI 角色與對話流程 [cite: 11]。
5.  [cite_start]**學習歷程分析與儀表板**：以 Event Sourcing 模式記錄互動事件，支援歷程回放與標註。提供視覺化儀表板呈現使用量、參與度與學習成效 [cite: 12]。
6.  [cite_start]**數據安全與權限管理**：採用四級權限架構（系統總管理者、學校管理者、教師、學生）與 RBAC 模型，符合資通安全責任等級中級防護基準 [cite: 13]。

### 2.3 雙軌應用模式
[cite_start]本系統提供以下雙軌應用模式 [cite: 14]：

* **第一軌：學生合作學習模式**
    [cite_start]提供學生「理想學習團隊」，透過與 AI 學伴互動培養溝通與批判思考。教師可設計矛盾觀點激發認知衝突，或安排程度較弱之 AI 學伴實踐「以教促學」。AI 學伴的知識精熟程度由 RAG 設定控制，風格由 System Prompt 定義 [cite: 15]。

* **第二軌：師資生模擬實習模式**
    [cite_start]提供虛擬實習場域，讓師資生演練差異化教學與班級經營。系統模擬不同特質的 AI 學生（如積極發問型、沈默被動型等）。系統完整保留互動歷程，支援重播、標註與自動生成教學分析報告，指導教授可線上回饋 [cite: 16]。

---

## 3. 專案目標

1.  [cite_start]**建構多代理人虛擬課堂核心引擎**：實現學生與虛擬學伴及教師的即時互動，模擬高效學習小組 [cite: 18]。
2.  [cite_start]**導入 MCP 與 Agentic RAG 以動態調控對話策略**：實現對話脈絡分析、動態角色發話與外部工具串接 [cite: 19]。
3.  [cite_start]**建置 RAG 學科知識庫以確保回應之正確性**：降低 AI 幻覺，確保內容可信度 [cite: 20]。
4.  [cite_start]**開發友善之視覺化情境設定介面**：降低使用門檻，適用於所有學科領域 [cite: 21]。
5.  [cite_start]**建構學習歷程分析與儀表板功能**：保留歷程供省思，提供視覺化數據 [cite: 22]。
6.  [cite_start]**確保技術可靠性與數據安全**：落實隱私機制，建立信任環境 [cite: 23]。

---

## 4. 專案需求說明

[cite_start]本專案開發需求依據專案目標分為六大模組，詳細規格如下 [cite: 25]：

### 4.1 模組一：多代理人虛擬課堂核心引擎

#### (一) 多代理人對話引擎架構
* [cite_start]**基礎框架**：須以 LangChain 或 LangGraph 為基礎 [cite: 28]。
* [cite_start]**核心元件** [cite: 28]：
    * `Agent Orchestrator`（代理人協調器）：管理生命週期與排程。
    * `State Manager`（狀態管理器）：維護上下文與共享記憶體。
    * `Message Router`（訊息路由器）：分配使用者訊息與代理人回應。
    * `Tool Executor`（工具執行器）：呼叫外部工具。
* [cite_start]**模型支援**：須同時支援多個 LLM API（OpenAI GPT-4o/GPT-4o-mini、Anthropic Claude 3.5 Sonnet/Claude 3 Haiku、Google Gemini 1.5 Pro/Gemini 1.5 Flash），每位代理人可獨立設定模型 [cite: 28]。
* [cite_start]**使用者介面 (UI)** [cite: 29]：
    * **左側參與者面板**：顯示角色頭像、名稱、標籤，點擊可查看設定。
    * **中央對話區域**：聊天室介面，區分發送者背景色，支援 Markdown、LaTeX 數學公式、程式碼語法高亮。
    * **右側情境資訊面板**：顯示學習主題、目標、時間、統計。
    * **底部輸入區域**：文字輸入、檔案上傳、語音輸入、送出按鈕。

#### (二) AI 代理人角色設定機制
* [cite_start]**資料結構**：以 JSON 管理參數組，包含：`base_model`、`system_prompt`、`knowledge_level` (1-10)、`communication_style` (formality, verbosity, encouragement)、`rag_knowledge_base_ids`、`temperature`、`max_tokens` [cite: 31]。
* [cite_start]**動態組裝**：每次對話須動態整合角色設定、對話歷史、RAG 結果與使用者輸入至 Prompt [cite: 31]。
* [cite_start]**設定頁面功能** [cite: 32]：
    * **基本資訊**：頭像上傳（支援 DALL-E 生成）、名稱、說明、問候語。
    * **進階設定**：LLM 模型選單、System Prompt 編輯（含範本）、知識精熟度滑桿、溝通風格滑桿、知識庫關聯選單、建議問題設定。
    * **測試功能**：預覽測試按鈕、儲存、另存為模板。

#### (三) 多角色對話協調機制
* [cite_start]**狀態機管理**：維護 `WAITING_USER`、`AGENT_THINKING`、`AGENT_RESPONDING`、`TOOL_EXECUTING` 等狀態 [cite: 34]。
* [cite_start]**回應邏輯** [cite: 34]：
    * 優先處理指定角色問題（如「老師請問...」）。
    * 若無指定，依 LLM 計算之 `relevance_score` 排序。
    * 支援規則設定（如「學生發言後教師必須回應」）。
* [cite_start]**三人對話 (Trialogue)**：確保人類與兩位 AI 之間形成有意義互動，避免 AI 間過度對話 [cite: 34]。

### 4.2 模組二：MCP 與 Agentic RAG 模組

#### (一) Model Context Protocol (MCP) 整合
* [cite_start]**架構實作**：包含 MCP Server（工具管理）、MCP Client（路由與執行）、Tool Registry（註冊表） [cite: 37]。
* **必備工具**：
    1.  [cite_start]**GeoGebra 數學工具**：繪製函數圖形、幾何圖形、代數運算，圖形須嵌入對話顯示 [cite: 38]。
    2.  [cite_start]**網頁搜尋工具**：整合搜尋引擎 API，提供即時資訊與來源網址 [cite: 39]。
    3.  [cite_start]**程式碼執行工具**：建置安全沙箱（如 Docker），支援 Python 執行與圖表輸出 [cite: 40]。
    4.  [cite_start]**計算機工具**：支援四則運算、三角函數等 [cite: 41]。
* [cite_start]**管理頁面**：卡片式清單顯示工具狀態與統計，支援參數設定與新增自訂工具 [cite: 42]。

#### (二) Agentic RAG 實作
* [cite_start]**核心組件** [cite: 44]：
    * `Query Analyzer`：分析是否檢索，產生優化查詢。
    * `Retrieval Planner`：決定檢索策略（知識庫選擇、top_k）。
    * `Result Evaluator`：評估結果品質，必要時觸發補充檢索。
    * `Response Synthesizer`：整合結果生成回應。
* [cite_start]**技術實作**：以 LangGraph 實作，支援條件分支與循環 [cite: 44]。
* [cite_start]**對話策略引擎**：根據目標進度、理解程度、氛圍、時間等因素，動態調整回應策略（解說/引導/提問）與檢索深度，透過 Prompt Engineering 實現 [cite: 45]。

### 4.3 模組三：RAG 知識庫管理模組

#### (一) 向量資料庫建置
* [cite_start]**資料庫選型**：Chroma, Milvus, Pinecone, Weaviate 或 PostgreSQL+pgvector [cite: 48]。
* [cite_start]**處理 Pipeline** [cite: 48]：
    * `Document Loader`：支援 PDF, DOCX, TXT, MD, HTML。
    * `Text Splitter`：RecursiveCharacterTextSplitter (chunk_size: 500-1000, overlap: 50-100)。
    * `Embedding Generator`：使用 OpenAI text-embedding-3-small 或同級模型。
    * `Vector Store`：儲存向量與 metadata。
* [cite_start]**管理頁面**：顯示知識庫清單。詳情頁包含「文件管理」（上傳/刪除/處理）、「設定」（權限/參數）、「檢索測試」（驗證品質）Tab [cite: 49]。

#### (二) 知識庫版本管理
* [cite_start]**機制**：每次變更產生版本記錄（版本號、操作類型、時間、變更摘要） [cite: 51]。
* [cite_start]**功能**：支援版本回溯（還原至歷史版本），頁面提供時間軸式的「版本歷史」檢視 [cite: 51]。

### 4.4 模組四：視覺化情境設定平臺

#### (一) Agentic Workflow 視覺化編輯器
* [cite_start]**前端技術**：React 搭配 react-flow 或類似套件 [cite: 54]。
* [cite_start]**節點類型**：Agent Node（代理人）、Trigger Node（觸發條件）、Condition Node（分支邏輯）、Action Node（動作）、End Node（結束） [cite: 54]。
* [cite_start]**儲存格式**：Graph 序列化為 JSON，由 Engine 解析執行 [cite: 54]。
* [cite_start]**介面佈局**：左側元件面板（拖曳用）、中央畫布（編輯與操作）、右側屬性面板（細節設定）、上方工具列與下方小地圖 [cite: 55]。

#### (二) 情境模板系統
* [cite_start]**預載模板**：「三人討論」、「蘇格拉底對話」、「以教促學」、「辯論」、「模擬課堂」 [cite: 57]。
* **功能**：支援將自訂情境存為模板、設定分享權限。
* [cite_start]**頁面設計**：卡片牆呈現，支援篩選與預覽，點擊「使用此模板」即可開啟新專案 [cite: 58]。

### 4.5 模組五：學習歷程分析與儀表板

#### (一) 學習歷程紀錄系統
* [cite_start]**儲存模式**：Event Sourcing。記錄 `MESSAGE_SENT`, `TOOL_INVOKED`, `RAG_RETRIEVED`, `AGENT_STATE_CHANGED` 等事件 [cite: 61]。
* **歷程回放介面**：聊天介面重現對話，支援時間軸拖曳、播放速度調整。
* [cite_start]**標註功能**：教師可新增評語（讚美/建議/問題），並匯出含標註的 PDF/Word 報告 [cite: 62]。

#### (二) 學習儀表板
* [cite_start]**分析 Pipeline**：定期產出指標（usage_metrics, engagement_metrics, learning_metrics） [cite: 64]。
* **視覺化**：使用 Chart.js 或 ECharts。支援折線圖、長條圖等。
* [cite_start]**Widget 設計**：班級使用概況、學生排行、熱門代理人、異常警示。支援自訂儀表板佈局與時間範圍篩選 [cite: 65]。

#### (三) 師資生教學省思模組
* [cite_start]**自動報告**：LLM 輔助生成「教學演練報告」，分析策略運用、互動比例、學生反應處理 [cite: 67]。
* **省思日誌**：提供結構化表單（目標、摘要、自評、心得、計畫）。
* [cite_start]**教授回饋**：指導教授可線上給予文字評語，系統發送通知 [cite: 67]。

### 4.6 模組六：權限管理與系統管理

#### (一) 帳號與權限管理
* [cite_start]**角色層級**：系統總管理者、學校管理者、教師、學生 [cite: 70]。
* [cite_start]**管理功能**：組織架構樹狀呈現，支援批次匯入/匯出使用者、批次指派 AI 代理人 [cite: 71]。

#### (二) 使用量監測與成本控管
* [cite_start]**API 追蹤**：記錄 user_id, provider, input/output tokens, cost, timestamp [cite: 73]。
* [cite_start]**配額管理**：設定 Token 上限，達標發送通知或暫停權限 [cite: 73]。
* [cite_start]**統計頁面**：提供依時間、使用者、模型、代理人等多維度分析圖表 [cite: 74]。

#### (三) 嵌入與整合功能
* **嵌入方式**：
    1.  **iframe 嵌入**：產生含 token 之程式碼。
    2.  [cite_start]**聊天氣泡嵌入**：JavaScript 程式碼，右下角顯示圖示 [cite: 76]。
* **安全機制**：支援 CORS、Referrer 白名單、頻率限制。
* [cite_start]**設定頁面**：提供外觀自訂、網域設定與即時預覽功能 [cite: 77]。