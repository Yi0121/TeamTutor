# TeamTutor 前端 Gap Analysis

> 本報告對比 `project.md` 規格與目前專案實作。
> 更新日期: 2026-01-15

---

## 總覽

| 模組 | 規格頁面/功能 | 目前狀態 |
|------|--------------|---------|
| 模組一：多代理人虛擬課堂核心引擎 | 虛擬課堂 UI | ✅ 完成 |
| 模組二：MCP 與 Agentic RAG | 工具管理頁面 | ✅ 完成 |
| 模組三：RAG 知識庫管理 | 知識庫管理 | ✅ 完成 |
| 模組四：視覺化情境設定平臺 | Workflow 編輯器 | ✅ 完成 |
| 模組五：學習歷程分析與儀表板 | 儀表板、歷程回放 | ✅ 完成 |
| 模組六：權限管理與系統管理 | 管理後台、嵌入設定 | ✅ 完成 |

---

## 高優先項目 (已完成 ✅)

1. **Markdown/LaTeX/程式碼渲染** - `MessageBubble.tsx` 已整合
2. **播放速度調整** - `PlaybackControls.tsx` 已有 0.5x/1x/1.5x/2x
3. **Workflow 儲存/載入** - `builder/page.tsx` 已實作 JSON 匯出/匯入

---

## 中優先項目 (已完成 ✅)

4. **知識庫文件管理 Tab** - `knowledge/[id]/page.tsx` 已有完整 Tab
5. **歷程標註功能** - `history/[id]/page.tsx` 已有標註 Dialog
6. **溝通風格三軸滑桿** - `agents/[id]/page.tsx` 已新增 formality/verbosity/encouragement

---

## 低優先項目 (尚未實作)

7. 語音輸入
8. DALL-E 頭像生成
9. 批次匯入/匯出使用者

---

## 附錄：專案結構

```
src/
├── app/
│   ├── admin/           # 系統管理後台
│   ├── agents/          # AI 代理人管理
│   ├── builder/         # Workflow 視覺化編輯器
│   ├── classroom/       # 虛擬課堂
│   ├── dashboard/       # 學習儀表板
│   ├── embed/           # 嵌入設定
│   ├── history/         # 學習歷程
│   ├── knowledge/       # 知識庫管理
│   ├── templates/       # 情境模板
│   └── tools/           # MCP 工具管理
├── components/
│   ├── builder/         # Builder 元件
│   ├── classroom/       # 對話介面元件
│   ├── history/         # 歷程回放元件
│   └── ui/              # shadcn/ui 基礎元件
└── types/               # TypeScript 型別定義
```
