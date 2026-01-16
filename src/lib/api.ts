// =============================================================================
// API Service Layer
// =============================================================================
// This module provides async API functions.
// Currently uses MockDataService, but can be switched to real APIs.

import MockDataService from './mock';
import type { Session, AgentConfig, KnowledgeBase } from '@/types';
import type { Tool, SessionHistory, User, SystemStats, Analytics } from './mock';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
    },

    // -------------------------------------------------------------------------
    // Agents
    // -------------------------------------------------------------------------
    agents: {
        list: async (): Promise<AgentConfig[]> => {
            await delay(400);
            return MockDataService.getAgents();
        },
        get: async (id: string): Promise<AgentConfig | null> => {
            await delay(300);
            return MockDataService.getAgentById(id);
        },
    },

    // -------------------------------------------------------------------------
    // Knowledge Bases
    // -------------------------------------------------------------------------
    knowledge: {
        list: async (): Promise<KnowledgeBase[]> => {
            await delay(400);
            return MockDataService.getKnowledgeBases();
        },
        get: async (id: string): Promise<KnowledgeBase | null> => {
            await delay(300);
            return MockDataService.getKnowledgeBaseById(id);
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
