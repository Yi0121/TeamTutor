import mockData from '../../mock_data.json';
import type { Session, AgentConfig, KnowledgeBase } from '@/types';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
    sessions: {
        list: async (): Promise<Session[]> => {
            await delay(500);
            return [mockData.session as unknown as Session];
        },
        get: async (id: string): Promise<Session | null> => {
            await delay(300);
            if (id === mockData.session.id) {
                return mockData.session as unknown as Session;
            }
            return null;
        },
    },
    agents: {
        list: async (): Promise<AgentConfig[]> => {
            await delay(400);
            return (mockData.agents || []) as AgentConfig[];
        },
    },
    knowledge: {
        list: async (): Promise<KnowledgeBase[]> => {
            await delay(400);
            return (mockData.knowledgeBases || []) as KnowledgeBase[];
        },
    },
    admin: {
        getStats: async () => {
            await delay(600);
            return (mockData as any).systemStats;
        },
    },
};
