// =============================================================================
// Mock Data Service - Centralized Data Management
// =============================================================================
// This module consolidates all mock data access.
// When integrating real APIs, replace implementations here.

import rawMockData from '../../../mock_data.json';
import type {
    Session,
    AgentConfig,
    KnowledgeBase,
    LLMModel,
    CommunicationStyleOption,
    DashboardStats,
} from '@/types';

// =============================================================================
// Type Definitions for Mock Data
// =============================================================================

export interface Tool {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    status: 'active' | 'inactive';
    callCount: number;
    lastUsed: string;
    parameters?: Record<string, unknown>;
}

export interface ToolLog {
    id: string;
    toolId: string;
    timestamp: string;
    input: Record<string, unknown>;
    output: string;
    duration: number;
    status: 'success' | 'error';
}

export interface SessionHistory {
    id: string;
    title: string;
    date: string;
    duration: string;
    participants: string[];
    messageCount: number;
    events: SessionEvent[];
}

export interface SessionEvent {
    time: string;
    type: string;
    sender?: string;
    senderId?: string;
    preview?: string;
    tool?: string;
    description?: string;
    content?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
    lastLogin: string;
    usage: {
        tokens: number;
        sessions: number;
    };
}

export interface SystemStats {
    totalUsers: number;
    activeUsers: number;
    totalSessions: number;
    totalTokens: number;
    serverStatus: 'healthy' | 'degraded' | 'down';
    vectorDbStatus: 'healthy' | 'degraded' | 'down';
    errorRate: number;
    apiLatency: number;
}

export interface Alert {
    id: string;
    type: 'warning' | 'error' | 'info';
    message: string;
    time: string;
}

export interface PopularAgent {
    id: string;
    name: string;
    usageCount: number;
    rating: number;
}

export interface Analytics {
    usageByModel: { modelId: string; name: string; tokens: number; cost: number }[];
    usageByUser: { userId: string; name: string; role: string; sessions: number; tokens: number }[];
    hourlyActivity: { hour: string; users: number }[];
    studentLeaderboard?: LeaderboardStudent[];
}

export interface LeaderboardStudent {
    rank: number;
    id: string;
    name: string;
    avatar: string;
    class: string;
    score: number;
    sessions: number;
    streak: number;
    badges: string[];
}

// =============================================================================
// Agent Template Types
// =============================================================================

export interface AgentTemplate {
    id: string;
    name: string;
    description: string;
    author: string;
    isSystem: boolean;
    tags: string[];
    usageCount: number;
    createdAt: string;
    preview: string;
}

export interface WorkflowTemplate {
    id: string;
    name: string;
    description: string;
    author: string;
    isSystem: boolean;
    tags: string[];
    usageCount: number;
    createdAt: string;
    nodeCount: number;
}

// =============================================================================
// Template Mock Data
// =============================================================================

const agentTemplates: AgentTemplate[] = [
    {
        id: 'tpl-agent-001',
        name: '友善數學導師',
        description: '專為數學教學設計的 AI 助教，善於用生活化的例子解釋抽象概念。',
        author: '系統預設',
        isSystem: true,
        tags: ['數學', '導師', '友善'],
        usageCount: 128,
        createdAt: '2024-01-15',
        preview: '你是一位友善的數學教學導師。請用生活化的例子來解釋數學概念，鼓勵學生提問，並在學生回答正確時給予讚美。',
    },
    {
        id: 'tpl-agent-002',
        name: '蘇格拉底問答者',
        description: '使用蘇格拉底式教學法，透過提問引導學生自行發現答案。',
        author: '系統預設',
        isSystem: true,
        tags: ['引導式', '思辨', '哲學'],
        usageCount: 89,
        createdAt: '2024-01-20',
        preview: '你是一位蘇格拉底式的引導者。不直接給出答案，而是透過一連串的問題引導學生思考，讓學生自行發現解答。',
    },
    {
        id: 'tpl-agent-003',
        name: '英語口說夥伴',
        description: '模擬英語母語者，透過日常對話幫助學生練習口語表達。',
        author: 'EnglishPro',
        isSystem: false,
        tags: ['英語', '口語', '對話'],
        usageCount: 45,
        createdAt: '2024-02-10',
        preview: 'You are a friendly English conversation partner. Help students practice speaking naturally.',
    },
    {
        id: 'tpl-agent-004',
        name: '歷史情境模擬者',
        description: '扮演歷史人物，讓學生透過對話身歷其境，了解歷史背景。',
        author: '系統預設',
        isSystem: true,
        tags: ['歷史', '角色扮演', '情境'],
        usageCount: 67,
        createdAt: '2024-02-15',
        preview: '你是一位歷史人物（依據指定）。請以該人物的口吻與視角與學生對話，幫助學生理解當時的歷史背景與時代氛圍。',
    },
    {
        id: 'tpl-agent-005',
        name: '程式碼審查專家',
        description: '模擬資深工程師進行 Code Review，幫助學生改善程式碼品質。',
        author: 'CodeMaster',
        isSystem: false,
        tags: ['程式', 'Code Review', '資訊'],
        usageCount: 76,
        createdAt: '2024-02-28',
        preview: '你是資深的軟體工程師，請針對學生的程式碼進行 Code Review，指出潛在錯誤與優化空間。',
    },
];

const workflowTemplates: WorkflowTemplate[] = [
    {
        id: 'tpl-wf-001',
        name: '基礎問答流程',
        description: '標準的學生提問、AI 回答、教師確認的三階段流程。',
        author: '系統預設',
        isSystem: true,
        tags: ['基礎', '問答', '標準'],
        usageCount: 256,
        createdAt: '2024-01-10',
        nodeCount: 5,
    },
    {
        id: 'tpl-wf-002',
        name: '三人對話模板',
        description: '一位學生與兩位 AI（學伴與教師）進行三方對話的標準流程。',
        author: '系統預設',
        isSystem: true,
        tags: ['三人對話', 'Trialogue', '協作'],
        usageCount: 189,
        createdAt: '2024-01-12',
        nodeCount: 8,
    },
    {
        id: 'tpl-wf-003',
        name: '認知衝突引導',
        description: '設計認知衝突情境，讓 AI 學伴提出不同觀點，促進深度思考。',
        author: '系統預設',
        isSystem: true,
        tags: ['認知衝突', '批判思考', '高階'],
        usageCount: 78,
        createdAt: '2024-01-18',
        nodeCount: 12,
    },
    {
        id: 'tpl-wf-004',
        name: 'PBL 專題研究',
        description: '問題導向學習的完整流程，從問題定義到成果發表。',
        author: '系統預設',
        isSystem: true,
        tags: ['PBL', '專題', '探究'],
        usageCount: 112,
        createdAt: '2024-01-25',
        nodeCount: 15,
    },
    {
        id: 'tpl-wf-005',
        name: '辯論比賽流程',
        description: '包含正方、反方 AI 與裁判 AI 的標準辯論流程控制。',
        author: 'DebateClub',
        isSystem: false,
        tags: ['辯論', '思辨', '多人'],
        usageCount: 34,
        createdAt: '2024-03-10',
        nodeCount: 9,
    },
];

// =============================================================================
// Mock Data Accessors
// =============================================================================

const mockData = rawMockData as {
    session: Session;
    agents: AgentConfig[];
    knowledgeBases: KnowledgeBase[];
    dashboardStats: DashboardStats;
    llmModels: LLMModel[];
    communicationStyles: CommunicationStyleOption[];
    tools: Tool[];
    toolLogs: ToolLog[];
    sessionHistory: SessionHistory[];
    users: User[];
    systemStats: SystemStats;
    alerts: Alert[];
    popularAgents: PopularAgent[];
    analytics: Analytics;
};

// =============================================================================
// Exported Data Accessors
// =============================================================================

export const MockDataService = {
    // Session
    getSession: () => mockData.session,
    getSessionById: (id: string) => (id === mockData.session.id ? mockData.session : null),

    // Agents
    getAgents: () => mockData.agents,
    getAgentById: (id: string) => mockData.agents.find((a) => a.id === id) || null,

    // Knowledge Bases
    getKnowledgeBases: () => mockData.knowledgeBases,
    getKnowledgeBaseById: (id: string) =>
        mockData.knowledgeBases.find((kb) => kb.id === id) || null,

    // Dashboard
    getDashboardStats: () => mockData.dashboardStats,

    // LLM Models
    getLLMModels: () => mockData.llmModels,
    getLLMModelById: (id: string) => mockData.llmModels.find((m) => m.id === id) || null,

    // Communication Styles
    getCommunicationStyles: () => mockData.communicationStyles,

    // Tools
    getTools: () => mockData.tools,
    getToolById: (id: string) => mockData.tools.find((t) => t.id === id) || null,
    getToolLogs: () => mockData.toolLogs,
    getToolLogsByToolId: (toolId: string) =>
        mockData.toolLogs.filter((log) => log.toolId === toolId),

    // Session History
    getSessionHistory: () => mockData.sessionHistory,
    getSessionHistoryById: (id: string) =>
        mockData.sessionHistory.find((s) => s.id === id) || null,

    // Users
    getUsers: () => mockData.users,
    getUserById: (id: string) => mockData.users.find((u) => u.id === id) || null,

    // System
    getSystemStats: () => mockData.systemStats,
    getAlerts: () => mockData.alerts,
    getPopularAgents: () => mockData.popularAgents,
    getAnalytics: () => mockData.analytics,

    // Templates
    getAgentTemplates: () => agentTemplates,
    getAgentTemplateById: (id: string) => agentTemplates.find((t) => t.id === id) || null,
    getWorkflowTemplates: () => workflowTemplates,
    getWorkflowTemplateById: (id: string) => workflowTemplates.find((t) => t.id === id) || null,
};

// =============================================================================
// Direct Exports (for backward compatibility)
// =============================================================================

export { mockData };
export default MockDataService;
