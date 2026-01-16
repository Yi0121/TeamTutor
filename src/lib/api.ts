// =============================================================================
// API Service Layer
// =============================================================================
// This module provides async API functions.
// Currently uses MockDataService, but can be switched to real APIs.
// 
// TODO: When backend is ready, replace Mock implementations with:
//   import { http } from './api-client';
//   return http.get<AgentConfig[]>('/agents');

import MockDataService from './mock';
import type { Session, AgentConfig, KnowledgeBase } from '@/types';
import type {
    CreateAgentRequest,
    UpdateAgentRequest,
    CreateKnowledgeBaseRequest,
    UpdateKnowledgeBaseRequest,
    CreateSessionRequest,
    UpdateSessionRequest,
    CreateUserRequest,
    UpdateUserRequest,
    CreateToolRequest,
    UpdateToolRequest,
} from '@/types/api';
import type { Tool, SessionHistory, User, SystemStats, Analytics } from './mock';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper: Generate mock ID
const generateId = () => `mock-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// =============================================================================
// API Methods
// =============================================================================

export const api = {
    // -------------------------------------------------------------------------
    // Sessions
    // -------------------------------------------------------------------------
    sessions: {
        list: async (): Promise<Session[]> => {
            await delay(500);
            const session = MockDataService.getSession();
            return session ? [session] : [];
        },
        get: async (id: string): Promise<Session | null> => {
            await delay(300);
            return MockDataService.getSessionById(id);
        },
        create: async (data: CreateSessionRequest): Promise<Session> => {
            await delay(400);
            // Mock implementation - returns a new session object
            const newSession: Session = {
                id: generateId(),
                title: data.title,
                participants: [],
                messages: [],
                learningGoals: (data.learningGoals || []).map((g, i) => ({
                    id: `goal-${i}`,
                    text: g.text,
                    completed: false,
                })),
                stats: { messageCount: 0, participantCount: 0, duration: '0m', tokensUsed: 0 },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            console.log('[Mock] Created session:', newSession.id);
            return newSession;
        },
        update: async (data: UpdateSessionRequest): Promise<Session> => {
            await delay(300);
            const existing = MockDataService.getSessionById(data.id);
            if (!existing) throw new Error(`Session ${data.id} not found`);
            const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
            console.log('[Mock] Updated session:', data.id);
            return updated;
        },
        delete: async (id: string): Promise<void> => {
            await delay(200);
            console.log('[Mock] Deleted session:', id);
        },
    },

    // -------------------------------------------------------------------------
    // Agents
    // -------------------------------------------------------------------------
    agents: {
        list: async (userId?: string): Promise<AgentConfig[]> => {
            await delay(400);
            return MockDataService.getAgents(userId);
        },
        get: async (id: string): Promise<AgentConfig | null> => {
            await delay(300);
            return MockDataService.getAgentById(id);
        },
        create: async (data: CreateAgentRequest): Promise<AgentConfig> => {
            await delay(400);
            const newAgent: AgentConfig = {
                id: generateId(),
                ownerId: 'current-user',
                isSystem: false,
                visibility: data.visibility || 'private',
                name: data.name,
                description: data.description,
                avatar: data.avatar || '/avatars/default.png',
                baseModel: data.baseModel,
                systemPrompt: data.systemPrompt,
                knowledgeLevel: data.knowledgeLevel,
                temperature: data.temperature,
                communicationStyle: data.communicationStyle as AgentConfig['communicationStyle'],
                communicationStyleDetailed: data.communicationStyleDetailed,
                ragKnowledgeBaseIds: data.ragKnowledgeBaseIds || [],
                suggestedQuestions: data.suggestedQuestions || [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            console.log('[Mock] Created agent:', newAgent.id);
            return newAgent;
        },
        update: async (data: UpdateAgentRequest): Promise<AgentConfig> => {
            await delay(300);
            const existing = MockDataService.getAgentById(data.id);
            if (!existing) throw new Error(`Agent ${data.id} not found`);
            const updated: AgentConfig = {
                ...existing,
                ...data,
                communicationStyle: (data.communicationStyle as AgentConfig['communicationStyle']) || existing.communicationStyle,
                updatedAt: new Date().toISOString(),
            };
            console.log('[Mock] Updated agent:', data.id);
            return updated;
        },
        delete: async (id: string): Promise<void> => {
            await delay(200);
            console.log('[Mock] Deleted agent:', id);
        },
    },

    // -------------------------------------------------------------------------
    // Knowledge Bases
    // -------------------------------------------------------------------------
    knowledge: {
        list: async (userId?: string): Promise<KnowledgeBase[]> => {
            await delay(400);
            return MockDataService.getKnowledgeBases(userId);
        },
        get: async (id: string): Promise<KnowledgeBase | null> => {
            await delay(300);
            return MockDataService.getKnowledgeBaseById(id);
        },
        create: async (data: CreateKnowledgeBaseRequest): Promise<KnowledgeBase> => {
            await delay(400);
            const newKB: KnowledgeBase = {
                id: generateId(),
                ownerId: 'current-user',
                allowedRoles: data.allowedRoles || ['teacher'],
                name: data.name,
                description: data.description,
                documentCount: 0,
                chunkCount: 0,
                lastUpdated: new Date().toISOString(),
            };
            console.log('[Mock] Created knowledge base:', newKB.id);
            return newKB;
        },
        update: async (data: UpdateKnowledgeBaseRequest): Promise<KnowledgeBase> => {
            await delay(300);
            const existing = MockDataService.getKnowledgeBaseById(data.id);
            if (!existing) throw new Error(`Knowledge base ${data.id} not found`);
            const updated = { ...existing, ...data, lastUpdated: new Date().toISOString() };
            console.log('[Mock] Updated knowledge base:', data.id);
            return updated;
        },
        delete: async (id: string): Promise<void> => {
            await delay(200);
            console.log('[Mock] Deleted knowledge base:', id);
        },
    },

    // -------------------------------------------------------------------------
    // Tools
    // -------------------------------------------------------------------------
    tools: {
        list: async (): Promise<Tool[]> => {
            await delay(400);
            return MockDataService.getTools();
        },
        get: async (id: string): Promise<Tool | null> => {
            await delay(300);
            return MockDataService.getToolById(id);
        },
        create: async (data: CreateToolRequest): Promise<Tool> => {
            await delay(400);
            const newTool: Tool = {
                id: generateId(),
                name: data.name,
                description: data.description,
                icon: data.icon,
                category: data.category,
                status: 'active',
                callCount: 0,
                lastUsed: new Date().toISOString(),
                parameters: data.parameters,
            };
            console.log('[Mock] Created tool:', newTool.id);
            return newTool;
        },
        update: async (data: UpdateToolRequest): Promise<Tool> => {
            await delay(300);
            const existing = MockDataService.getToolById(data.id);
            if (!existing) throw new Error(`Tool ${data.id} not found`);
            const updated = { ...existing, ...data };
            console.log('[Mock] Updated tool:', data.id);
            return updated;
        },
        delete: async (id: string): Promise<void> => {
            await delay(200);
            console.log('[Mock] Deleted tool:', id);
        },
    },

    // -------------------------------------------------------------------------
    // History
    // -------------------------------------------------------------------------
    history: {
        list: async (): Promise<SessionHistory[]> => {
            await delay(400);
            return MockDataService.getSessionHistory();
        },
        get: async (id: string): Promise<SessionHistory | null> => {
            await delay(300);
            return MockDataService.getSessionHistoryById(id);
        },
    },

    // -------------------------------------------------------------------------
    // Users
    // -------------------------------------------------------------------------
    users: {
        list: async (): Promise<User[]> => {
            await delay(400);
            return MockDataService.getUsers();
        },
        get: async (id: string): Promise<User | null> => {
            await delay(300);
            return MockDataService.getUserById(id);
        },
        create: async (data: CreateUserRequest): Promise<User> => {
            await delay(400);
            const newUser: User = {
                id: generateId(),
                name: data.name,
                email: data.email,
                role: data.role,  // UserRole type matches
                status: 'active',
                lastLogin: new Date().toISOString(),
                usage: { tokens: 0, sessions: 0 },
            };
            console.log('[Mock] Created user:', newUser.id);
            return newUser;
        },
        update: async (data: UpdateUserRequest): Promise<User> => {
            await delay(300);
            const existing = MockDataService.getUserById(data.id);
            if (!existing) throw new Error(`User ${data.id} not found`);
            const updated: User = {
                ...existing,
                ...data,
                role: data.role || existing.role as User['role'],
            };
            console.log('[Mock] Updated user:', data.id);
            return updated;
        },
        delete: async (id: string): Promise<void> => {
            await delay(200);
            console.log('[Mock] Deleted user:', id);
        },
    },

    // -------------------------------------------------------------------------
    // Admin
    // -------------------------------------------------------------------------
    admin: {
        getStats: async (): Promise<SystemStats> => {
            await delay(600);
            return MockDataService.getSystemStats();
        },
        getAnalytics: async (): Promise<Analytics> => {
            await delay(500);
            return MockDataService.getAnalytics();
        },
    },

    // -------------------------------------------------------------------------
    // Dashboard
    // -------------------------------------------------------------------------
    dashboard: {
        getStats: async () => {
            await delay(400);
            return MockDataService.getDashboardStats();
        },
        getAlerts: async () => {
            await delay(300);
            return MockDataService.getAlerts();
        },
        getPopularAgents: async () => {
            await delay(300);
            return MockDataService.getPopularAgents();
        },
    },

    // -------------------------------------------------------------------------
    // Templates
    // -------------------------------------------------------------------------
    templates: {
        getAgentTemplates: async () => {
            await delay(300);
            return MockDataService.getAgentTemplates();
        },
        getWorkflowTemplates: async () => {
            await delay(300);
            return MockDataService.getWorkflowTemplates();
        },
    },
};

export default api;
