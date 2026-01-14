
---

### Participants Panel (Left)
- Avatar
- Name
- Role Tag（Virtual Teacher / AI Peer / Student）
- Status Indicator（Thinking / Responding / Idle）
- Click → Read-only Agent Config Drawer

---

### Chat Area (Center)
Each message contains:
- Sender avatar
- Sender name
- Content block
  - Markdown
  - LaTeX
  - Code block (syntax highlight)
  - MCP tool result (embedded)

Visual rules:
- Different background color per role
- Tool message must show tool badge

---

### Context Panel (Right)
- Current topic
- Learning goals checklist
- Elapsed time
- Statistics
  - Message count
  - Tool usage count

---

### Input Bar (Bottom)
- Multiline text input
- File upload button
- Voice input button
- Send button

---

## Module 2：AI Agent Configuration

### Page Structure
- Basic Info Section
- Advanced Settings Section

---

### Basic Info
- Avatar upload / AI generate
- Name input
- Role description
- Initial greeting

---

### Advanced Settings

#### Model
- LLM dropdown selector

#### Prompt
- System prompt multiline editor
- Insert template button

#### Knowledge & Style
- Knowledge level slider (1–10)
- Style sliders
  - Formality
  - Verbosity
  - Encouragement

#### RAG Binding
- Knowledge base multi-select

#### Suggested Questions
- Multiple preset buttons
  - Display text
  - Actual prompt

---

### Actions
- Preview Test
- Save
- Save as Template

---

## Module 3：MCP & Agentic RAG

### MCP Tool List Page
Tool card shows:
- Icon
- Name
- Description
- Enable/Disable
- Usage count

---

### MCP Tool Detail
- Basic info
- API key & parameters
- Permission settings
- Usage log
- Test tool

---

### Agentic RAG Indicators (In Chat)
- Retrieval triggered
- Knowledge base used
- Retrieval depth

---

## Module 4：RAG Knowledge Base

### Knowledge Base List
Card shows:
- Name
- Description
- File count
- Last updated
- Linked agents count

---

### Knowledge Base Detail Tabs

#### Files
- File list
- Drag & drop upload
- Batch upload
- Delete / Reprocess

#### Settings
- Name
- Description
- Chunk parameters
- Embedding model
- Access control

#### Retrieval Test
- Query input
- Chunk results
- Similarity score

#### Version History
- Timeline view
- Change detail
- Restore version

---

## Module 5：Visual Scenario Designer

### Workflow Editor Layout
- Left: Node Library
- Center: Canvas (react-flow)
- Right: Property Panel

---

### Node Types
- Agent Node
- Trigger Node
- Condition Node
- Action Node
- End Node

---

### Canvas Toolbar
- Save
- Load template
- Export
- Preview
- Undo / Redo
- Zoom

---

### Scenario Templates
- System Templates
- My Templates

Template card:
- Workflow preview
- Name
- Description
- Tags
- Author
- Usage count

---

## Module 6：Learning Analytics & System Admin

### Learning History
Left:
- Session list (date, agents, message count, summary)

Right:
- Chat replay
- Timeline control
- Playback speed

Annotation:
- Praise / Suggestion / Question
- Side color marker

---

### Dashboard
Widget-based layout:
- Class usage overview
- Student ranking
- Popular agents
- Alerts

Features:
- Drag & resize
- Time range selector
- Export data

---

### Permission & Management
- Organization tree (School → Class → User)
- User detail panel
- Batch operations

---

### Embedding Settings
Left:
- Embed type (iframe / bubble)
- Appearance
- Allowed domains
- Token management

Right:
- Live preview

Bottom:
- Copyable embed code
